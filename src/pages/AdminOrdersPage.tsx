import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AdminOrdersPage = () => {
  const {
    orders,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    updateOrderStatus,
    addShippingInfo,
    refundOrder,
  } = useAdminOrders();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Orders Management</h1>
            <p className="text-muted-foreground">View and manage all customer orders</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter and search orders</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  paymentFilter={paymentFilter}
                  onPaymentFilterChange={setPaymentFilter}
                  orders={orders}
                />
              </CardContent>
            </Card>

            {/* Orders Table */}
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Orders ({orders.length})
                  </CardTitle>
                  <CardDescription>
                    Manage order statuses, shipping, and refunds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <OrdersTable
                      orders={orders}
                      onStatusChange={updateOrderStatus}
                      onAddShipping={addShippingInfo}
                      onRefund={refundOrder}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrdersPage;
