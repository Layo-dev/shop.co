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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ShippingInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSubmit: (orderId: string, carrier: string, trackingNumber: string) => Promise<void>;
}

const CARRIERS = [
  'DHL',
  'FedEx',
  'UPS',
  'USPS',
  'GIG Logistics',
  'Kwik Delivery',
  'Sendbox',
  'Other',
];

export const ShippingInfoDialog = ({
  open,
  onOpenChange,
  orderId,
  onSubmit,
}: ShippingInfoDialogProps) => {
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!carrier || !trackingNumber) return;

    setLoading(true);
    try {
      await onSubmit(orderId, carrier, trackingNumber);
      setCarrier('');
      setTrackingNumber('');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Add Shipping Information</DialogTitle>
          <DialogDescription className="text-sm">
            Enter the shipping carrier and tracking number for this order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carrier">Shipping Carrier</Label>
            <Select value={carrier} onValueChange={setCarrier}>
              <SelectTrigger id="carrier">
                <SelectValue placeholder="Select carrier" />
              </SelectTrigger>
              <SelectContent>
                {CARRIERS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!carrier || !trackingNumber || loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Saving...' : 'Save Shipping Info'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
