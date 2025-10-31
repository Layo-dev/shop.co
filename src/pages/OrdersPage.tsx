import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Eye, RotateCcw, X } from 'lucide-react';
import { useOrders, Order } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { useState } from 'react';
import { OrderDetailsDialog } from '@/components/OrderDetailsDialog';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/data/products';

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, cancelOrder, reorderItems } = useOrders();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleReorder = async (orderId: string) => {
    const items = await reorderItems(orderId);
    if (items) {
      items.forEach((item) => {
        if (item.products) {
          addItem({
            productId: parseInt(item.product_id),
            product: {
              id: parseInt(item.product_id),
              title: item.products.title,
              price: item.products.price,
              image: item.products.image_url || '',
              images: item.products.images || [],
              rating: 0,
              reviews: 0,
              category: "",
              subcategory: "",
              color: item.color || '',
              sizes: item.size ? [item.size] : [],
              style: "",
              createdAt: new Date().toISOString(),
            },
            selectedSize: item.size || '',
            selectedColor: item.color ? { name: item.color, value: item.color } : undefined,
            quantity: item.quantity,
          });
        }
      });
      toast({
        title: "Items added to cart",
        description: `${items.length} item(s) from your order have been added to cart`,
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    await cancelOrder(orderId);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/account">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Link>
              </Button>
            </div>
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/account">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">View and track your order history</p>
          </div>

          {orders.length === 0 ? (
            <Card className="glass-card text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here
                </p>
                <Button asChild>
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="glass-card">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <span className="font-semibold">
                          ₦{order.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {order.order_items?.length || 0} item(s)
                        </p>
                        {order.order_items && order.order_items.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            First item: Product ID {order.order_items[0].product_id.slice(-8)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReorder(order.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reorder
                        </Button>
                        {order.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <OrderDetailsDialog 
        order={selectedOrder} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </div>
  );
};

export default OrdersPage;