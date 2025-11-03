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
import { MoreHorizontal, Eye, Truck, CheckCircle } from 'lucide-react';
import { AdminOrder } from '@/hooks/useAdminOrders';
import {
  formatOrderNumber,
  formatCurrency,
  getOrderStatusColor,
  getPaymentStatusColor,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/lib/orderUtils';
import { OrderStatusDropdown } from './OrderStatusDropdown';
import { ShippingInfoDialog } from './ShippingInfoDialog';
import { RefundDialog } from './RefundDialog';
import { OrderDetailsModal } from './OrderDetailsModal';

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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-mono text-sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      {formatOrderNumber(order.id)}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{order.items_count}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
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
                  <TableCell>
                    {order.shipping_carrier && order.tracking_number ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{order.shipping_carrier}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {order.tracking_number}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not shipped</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick Actions */}
                      {order.status === 'processing' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkShipped(order)}
                          title="Mark as Shipped"
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === 'shipped' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkDelivered(order.id)}
                          title="Mark as Delivered"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}

                      {/* More Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkShipped(order)}>
                            <Truck className="mr-2 h-4 w-4" />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
