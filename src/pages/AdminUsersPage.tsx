import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Filter } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdminUsers, UserWithRole } from '@/hooks/useAdminUsers';
import { UserTable } from '@/components/admin/UserTable';
import { MobileUserCard } from '@/components/admin/MobileUserCard';
import { UserFilters } from '@/components/admin/UserFilters';
import { UserRoleDialog } from '@/components/admin/UserRoleDialog';

const AdminUsersPage = () => {
  const isMobile = useIsMobile();
  const { users, loading, filters, setFilters, updateUserRole } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const handleEditRole = (user: UserWithRole) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const renderFilters = () => (
    <UserFilters
      filters={filters}
      onFilterChange={setFilters}
      userCount={users.length}
    />
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-2">
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">View and manage user roles and permissions</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  {renderFilters()}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            {isMobile && (
              <div className="mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      {renderFilters()}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}

            {/* Users List */}
            {loading ? (
              renderLoadingSkeleton()
            ) : isMobile ? (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      No users found matching your filters.
                    </CardContent>
                  </Card>
                ) : (
                  users.map((user) => (
                    <MobileUserCard
                      key={user.user_id}
                      user={user}
                      onEditRole={handleEditRole}
                    />
                  ))
                )}
              </div>
            ) : (
              <UserTable users={users} onEditRole={handleEditRole} />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Role Dialog */}
      <UserRoleDialog
        user={selectedUser}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onUpdateRole={updateUserRole}
      />
    </div>
  );
};

export default AdminUsersPage;
