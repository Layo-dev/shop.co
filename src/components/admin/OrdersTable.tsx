import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Truck, CheckCircle } from 'lucide-react';
import { AdminOrder } from '@/hooks/useAdminOrders';
import {
  formatOrderNumber,
  formatCurrency,
  getOrderStatusColor,
  getPaymentStatusColor,
  formatOrderStatus,
  formatPaymentStatus,
  formatDate,
} from '@/lib/orderUtils';
import { OrderStatusDropdown } from './OrderStatusDropdown';
import { ShippingInfoDialog } from './ShippingInfoDialog';
import { RefundDialog } from './RefundDialog';
import { MobileOrderCard } from './MobileOrderCard';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrdersTableProps {
  orders: AdminOrder[];
  onStatusChange: (orderId: string, status: string) => Promise<void>;
  onAddShipping: (orderId: string, carrier: string, tracking: string) => Promise<void>;
  onRefund: (orderId: string, amount: number, reason: string) => Promise<void>;
}

export const OrdersTable = ({
  orders,
  onStatusChange,
  onAddShipping,
  onRefund,
}: OrdersTableProps) => {
  const isMobile = useIsMobile();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionOrderId, setActionOrderId] = useState<string>('');

  const handleMarkShipped = (order: AdminOrder) => {
    setActionOrderId(order.id);
    setShippingDialogOpen(true);
  };

  const handleMarkDelivered = (orderId: string) => {
    onStatusChange(orderId, 'delivered');
  };

  const handleRefund = (order: AdminOrder) => {
    setSelectedOrder(order);
    setRefundDialogOpen(true);
  };

  const handleViewDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  return (
    <>
      {isMobile ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
              onMarkShipped={handleMarkShipped}
              onMarkDelivered={handleMarkDelivered}
              onRefund={handleRefund}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Shipping</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const canShip = order.status === 'pending' || order.status === 'processing';
                const canDeliver = order.status === 'shipped';

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => handleViewDetails(order)}
                      >
                        {formatOrderNumber(order.id)}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.order_items?.length || 0}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell>
                      <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {formatPaymentStatus(order.payment_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <OrderStatusDropdown
                        currentStatus={order.status}
                        orderId={order.id}
                        onStatusChange={onStatusChange}
                      />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {order.tracking_number ? (
                        <div>
                          <p className="text-sm font-medium">{order.shipping_carrier}</p>
                          <p className="text-xs text-muted-foreground">{order.tracking_number}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(order.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canShip && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkShipped(order)}
                          >
                            Mark Shipped
                          </Button>
                        )}
                        {canDeliver && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkDelivered(order.id)}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkShipped(order)}>
                              Add Shipping Info
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRefund(order)}>
                              Refund Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ShippingInfoDialog
        open={shippingDialogOpen}
        onOpenChange={setShippingDialogOpen}
        orderId={actionOrderId}
        onSubmit={onAddShipping}
      />

      <RefundDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        order={selectedOrder}
        onSubmit={onRefund}
      />

      <OrderDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        order={selectedOrder}
      />
    </>
  );
};
