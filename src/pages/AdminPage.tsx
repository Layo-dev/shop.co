import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Settings, Users, BarChart, ShoppingBag } from 'lucide-react';

const AdminPage = () => {
  const adminCards = [
    {
      title: 'Orders Management',
      description: 'View and manage customer orders',
      icon: ShoppingBag,
      link: '/admin/orders',
      color: 'text-indigo-500'
    },
    {
      title: 'Product Management',
      description: 'Add, edit, and manage your product catalog',
      icon: Package,
      link: '/admin/products',
      color: 'text-blue-500'
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      link: '/admin/users',
      color: 'text-green-500'
    },
    {
      title: 'Analytics',
      description: 'View sales and performance metrics',
      icon: BarChart,
      link: '/admin/analytics',
      color: 'text-purple-500'
    },
    {
      title: 'Settings',
      description: 'Configure store settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your e-commerce store</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} to={card.link}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <Icon className={`h-8 w-8 ${card.color} mb-2`} />
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
