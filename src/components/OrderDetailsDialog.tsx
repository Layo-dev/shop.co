import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const OrderDetailsDialog = ({ order, open, onOpenChange }: OrderDetailsDialogProps) => {
  if (!order) return null;

  const getImageUrl = (item: any) => {
    const product = item.products;
    if (!product) return '/placeholder.svg';
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return product.image_url || '/placeholder.svg';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Order ID</p>
              <p className="font-mono text-xs">{order.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p>{format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={getImageUrl(item)}
                    alt={item.products?.title || 'Product'}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.products?.title || 'Product'}</h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      <p>Quantity: {item.quantity}</p>
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(item.price_at_time).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(Number(item.price_at_time) * item.quantity).toFixed(2)} total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Addresses */}
          <div className="grid md:grid-cols-2 gap-6">
            {order.shipping_address && (
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.shipping_address.name}</p>
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            )}
            {order.billing_address && (
              <div>
                <h3 className="font-semibold mb-2">Billing Address</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.billing_address.name}</p>
                  <p>{order.billing_address.street}</p>
                  <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</p>
                  <p>{order.billing_address.country}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(order.total_amount))}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
