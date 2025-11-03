import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AdminOrder } from '@/hooks/useAdminOrders';
import {
  formatOrderNumber,
  formatCurrency,
  getOrderStatusColor,
  getPaymentStatusColor,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/lib/orderUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
}

export const OrderDetailsModal = ({
  open,
  onOpenChange,
  order,
}: OrderDetailsModalProps) => {
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (order) {
      setNotes(order.notes || '');
      fetchOrderItems();
    }
  }, [order]);

  const fetchOrderItems = async () => {
    if (!order) return;

    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id (
            title,
            images
          )
        `)
        .eq('order_id', order.id);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ notes })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notes updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (images: any) => {
    if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }
    return null;
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            Order {formatOrderNumber(order.id)}
            <Badge className={getOrderStatusColor(order.status)}>
              {formatOrderStatus(order.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Created on {new Date(order.created_at).toLocaleString('en-US', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {order.customer_name}</p>
              <p className="break-all"><strong>Email:</strong> {order.customer_email}</p>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Payment Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Badge className={getPaymentStatusColor(order.payment_status)}>
                  {formatPaymentStatus(order.payment_status)}
                </Badge>
              </div>
              {order.payment_method && (
                <p className="text-sm"><strong>Method:</strong> {order.payment_method}</p>
              )}
              {order.refund_amount && order.refund_amount > 0 && (
                <div className="text-sm">
                  <p><strong>Refunded:</strong> {formatCurrency(order.refund_amount)}</p>
                  {order.refund_reason && (
                    <p><strong>Reason:</strong> {order.refund_reason}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Shipping Information */}
          <div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Shipping Information</h3>
            {order.shipping_carrier && order.tracking_number ? (
              <div className="space-y-1 text-sm">
                <p><strong>Carrier:</strong> {order.shipping_carrier}</p>
                <p><strong>Tracking:</strong> {order.tracking_number}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shipping information available</p>
            )}
            {order.shipping_address && (
              <div className="mt-2 text-sm">
                <p className="font-medium">Shipping Address:</p>
                <p>{order.shipping_address.address_line}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                <p>{order.shipping_address.postal_code}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Order Items</h3>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 p-3 border rounded-lg">
                  {item.products?.images && (
                    <img
                      src={getImageUrl(item.products.images)}
                      alt={item.products.title}
                      className="w-full sm:w-16 h-40 sm:h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">{item.products?.title || 'Product'}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {formatCurrency(item.price_at_time)}
                    </p>
                    {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-muted-foreground">Color: {item.color}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm sm:text-base">
                      {formatCurrency(item.quantity * item.price_at_time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Admin Notes */}
          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this order..."
              rows={4}
              className="mt-2"
            />
            <Button
              onClick={handleSaveNotes}
              disabled={loading || notes === (order.notes || '')}
              className="mt-2"
              size="sm"
            >
              {loading ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
