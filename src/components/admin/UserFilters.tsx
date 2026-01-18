import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface Filters {
  search: string;
  role: AppRole | 'all';
}

interface UserFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  userCount: number;
}

export const UserFilters = ({ filters, onFilterChange, userCount }: UserFiltersProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Filters</h3>
        <p className="text-sm text-muted-foreground">
          {userCount} user{userCount !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or phone..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={filters.role}
            onValueChange={(value) => onFilterChange({ ...filters, role: value as AppRole | 'all' })}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
