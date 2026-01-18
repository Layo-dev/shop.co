import { User, Phone, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { UserWithRole } from '@/hooks/useAdminUsers';

interface MobileUserCardProps {
  user: UserWithRole;
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

export const MobileUserCard = ({ user, onEditRole }: MobileUserCardProps) => {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'No name';
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate">{fullName}</h3>
              <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize shrink-0">
                {user.role}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="truncate">{user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {format(new Date(user.created_at), 'MMM d, yyyy')}</span>
              </div>

              {user.last_login && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last login {format(new Date(user.last_login), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onEditRole(user)}
          >
            <User className="h-4 w-4 mr-2" />
            Change Role
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
