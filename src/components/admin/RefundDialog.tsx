import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency, getRefundableAmount } from '@/lib/orderUtils';
import { AdminOrder } from '@/hooks/useAdminOrders';

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
  onSubmit: (orderId: string, amount: number, reason: string) => Promise<void>;
}

export const RefundDialog = ({
  open,
  onOpenChange,
  order,
  onSubmit,
}: RefundDialogProps) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const refundableAmount = order ? getRefundableAmount(order) : 0;

  const handleSubmit = async () => {
    if (!order || !amount || !reason) return;

    const refundAmount = parseFloat(amount);
    if (refundAmount <= 0 || refundAmount > refundableAmount) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(order.id, refundAmount, reason);
      setAmount('');
      setReason('');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFullRefund = () => {
    setAmount(refundableAmount.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Process Refund</DialogTitle>
          <DialogDescription className="text-sm">
            Enter the refund amount and reason for this order.
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Already Refunded:</span>
                <span className="font-medium">
                  {formatCurrency(order.refund_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Refundable Amount:</span>
                <span>{formatCurrency(refundableAmount)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Refund Amount</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleFullRefund}
                  className="h-auto p-0"
                >
                  Full refund
                </Button>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={refundableAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              {amount && parseFloat(amount) > refundableAmount && (
                <p className="text-sm text-destructive">
                  Amount exceeds refundable amount
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Refund Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for refund..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !amount ||
              !reason ||
              loading ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > refundableAmount
            }
            className="w-full sm:w-auto"
          >
            {loading ? 'Processing...' : 'Process Refund'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
