import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { formatOrderStatus, getOrderStatusColor } from '@/lib/orderUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface OrderStatusDropdownProps {
  currentStatus: string;
  orderId: string;
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>;
}

const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'on_hold',
];

export const OrderStatusDropdown = ({
  currentStatus,
  orderId,
  onStatusChange,
}: OrderStatusDropdownProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const handleStatusClick = (newStatus: string) => {
    // Show confirmation for critical status changes
    if (newStatus === 'cancelled' || newStatus === 'refunded') {
      setPendingStatus(newStatus);
      setShowConfirm(true);
    } else {
      onStatusChange(orderId, newStatus);
    }
  };

  const handleConfirm = () => {
    if (pendingStatus) {
      onStatusChange(orderId, pendingStatus);
    }
    setShowConfirm(false);
    setPendingStatus(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <Badge className={getOrderStatusColor(currentStatus)}>
              {formatOrderStatus(currentStatus)}
            </Badge>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {ORDER_STATUSES.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusClick(status)}
              disabled={status === currentStatus}
            >
              <Badge className={getOrderStatusColor(status)}>
                {formatOrderStatus(status)}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this order's status to{' '}
              <strong>{pendingStatus && formatOrderStatus(pendingStatus)}</strong>? This
              action may affect the customer's order and payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
