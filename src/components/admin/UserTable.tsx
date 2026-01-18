import { MoreHorizontal, UserCog } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { UserWithRole } from '@/hooks/useAdminUsers';

interface UserTableProps {
  users: UserWithRole[];
  onEditRole: (user: UserWithRole) => void;
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'moderator':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const UserTable = ({ users, onEditRole }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No users found matching your filters.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">User</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'No name';
            const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';

            return (
              <TableRow key={user.user_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{fullName}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        ID: {user.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {user.phone || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {user.last_login
                      ? format(new Date(user.last_login), 'MMM d, yyyy')
                      : 'Never'}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditRole(user)}>
                        <UserCog className="h-4 w-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
