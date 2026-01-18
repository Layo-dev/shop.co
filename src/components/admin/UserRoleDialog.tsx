import { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserWithRole } from '@/hooks/useAdminUsers';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserRoleDialogProps {
  user: UserWithRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRole: (userId: string, newRole: AppRole) => Promise<boolean>;
}

export const UserRoleDialog = ({ user, open, onOpenChange, onUpdateRole }: UserRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'No name';
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';
  const showAdminWarning = selectedRole === 'admin' && user.role !== 'admin';

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedRole('');
    } else {
      setSelectedRole(user.role);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async () => {
    if (!selectedRole || selectedRole === user.role) return;

    setLoading(true);
    const success = await onUpdateRole(user.user_id, selectedRole);
    setLoading(false);

    if (success) {
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Change User Role
          </DialogTitle>
          <DialogDescription>
            Update the role and permissions for this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{fullName}</p>
              <p className="text-sm text-muted-foreground capitalize">
                Current role: {user.role}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-role">New Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as AppRole)}
            >
              <SelectTrigger id="new-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showAdminWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Admin users have full access to manage the store, including orders, products, and other users. Only assign this role to trusted individuals.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedRole || selectedRole === user.role}
          >
            {loading ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
