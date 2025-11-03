import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

const AdminOrdersPage = () => {
  const isMobile = useIsMobile();
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

  const filtersContent = (
    <OrderFilters
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      paymentFilter={paymentFilter}
      onPaymentFilterChange={setPaymentFilter}
      orders={orders}
    />
  );

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Orders Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">View and manage all customer orders</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Mobile Filter Button */}
            {isMobile ? (
              <div className="mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      {filtersContent}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            ) : (
              /* Desktop Filters Sidebar */
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>Filter and search orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {filtersContent}
                </CardContent>
              </Card>
            )}

            {/* Orders Table/Cards */}
            <div className={isMobile ? "col-span-1" : "lg:col-span-3"}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Orders ({orders.length})
                  </CardTitle>
                  <CardDescription className="text-sm">
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
