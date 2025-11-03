import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatOrderNumber, formatCurrency, formatPaymentStatus, formatDate } from "@/lib/orderUtils";
import { OrderStatusDropdown } from "./OrderStatusDropdown";
import { MoreVertical, Package, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileOrderCardProps {
  order: any;
  onViewDetails: (order: any) => void;
  onMarkShipped: (order: any) => void;
  onMarkDelivered: (orderId: string) => void;
  onRefund: (order: any) => void;
}

export const MobileOrderCard = ({
  order,
  onViewDetails,
  onMarkShipped,
  onMarkDelivered,
  onRefund,
}: MobileOrderCardProps) => {
  const canShip = order.status === 'pending' || order.status === 'processing';
  const canDeliver = order.status === 'shipped';

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <Button 
          variant="link" 
          className="p-0 h-auto font-semibold text-base"
          onClick={() => onViewDetails(order)}
        >
          {formatOrderNumber(order.id)}
        </Button>
        <OrderStatusDropdown
          currentStatus={order.status}
          orderId={order.id}
          onStatusChange={async () => {}}
        />
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-muted-foreground text-xs">{order.customer_email}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
            {formatPaymentStatus(order.payment_status)}
          </Badge>
          <span className="font-semibold">{formatCurrency(order.total_amount)}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="h-3 w-3" />
          <span>{order.order_items?.length || 0} items</span>
        </div>

        {order.tracking_number && (
          <div className="flex items-center gap-2 text-xs">
            <Truck className="h-3 w-3" />
            <span className="font-mono">{order.tracking_number}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails(order)}
        >
          View Details
        </Button>
        
        {canShip && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onMarkShipped(order)}
          >
            Mark Shipped
          </Button>
        )}
        
        {canDeliver && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onMarkDelivered(order.id)}
          >
            Mark Delivered
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(order)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMarkShipped(order)}>
              Add Shipping Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRefund(order)}>
              Refund Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
