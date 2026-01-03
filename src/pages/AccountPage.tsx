import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/TopNav';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Heart, Settings, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const menuItems = [
    {
      title: 'Orders',
      description: 'View your order history and track shipments',
      icon: Package,
      href: '/account/orders',
      color: 'text-blue-600',
    },
    {
      title: 'Wishlist',
      description: 'Items you want to purchase later',
      icon: Heart,
      href: '/account/wishlist',
      color: 'text-red-600',
    },
    {
      title: 'Addresses',
      description: 'Manage your shipping and billing addresses',
      icon: MapPin,
      href: '/account/addresses',
      color: 'text-green-600',
    },
    {
      title: 'Settings',
      description: 'Update your profile and preferences',
      icon: Settings,
      href: '/account/settings',
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card key={item.title} className="glass-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${item.color}`} />
                      <CardTitle>{item.title}</CardTitle>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to={item.href}>
                        Go to {item.title}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;