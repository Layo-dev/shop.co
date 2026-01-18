import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export interface UserWithRole {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  last_login: string | null;
  role: AppRole;
  email?: string;
}

interface Filters {
  search: string;
  role: AppRole | 'all';
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    role: 'all',
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch profiles - they have the role column
      let query = supabase
        .from('profiles')
        .select('user_id, first_name, last_name, phone, avatar_url, created_at, last_login, role')
        .order('created_at', { ascending: false });

      // Apply role filter
      if (filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      // Apply search filter client-side (for name and phone)
      let filteredUsers = profilesData || [];
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => {
          const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
          const phone = (user.phone || '').toLowerCase();
          return fullName.includes(searchLower) || phone.includes(searchLower);
        });
      }

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, newRole: AppRole): Promise<boolean> => {
    try {
      // Check if we're removing the last admin
      if (newRole !== 'admin') {
        const { data: admins, error: countError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (countError) throw countError;

        const isLastAdmin = admins?.length === 1 && admins[0].user_id === userId;
        if (isLastAdmin) {
          toast.error('Cannot remove the last admin. Assign another admin first.');
          return false;
        }
      }

      // Update role in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Update or insert role in user_roles table
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingRole) {
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });

        if (insertError) throw insertError;
      }

      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      return false;
    }
  };

  return {
    users,
    loading,
    filters,
    setFilters,
    updateUserRole,
    refetch: fetchUsers,
  };
};
