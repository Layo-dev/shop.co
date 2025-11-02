import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, Download } from 'lucide-react';
import { exportOrdersToCSV, formatOrderStatus, formatPaymentStatus } from '@/lib/orderUtils';
import { AdminOrder } from '@/hooks/useAdminOrders';

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (statuses: string[]) => void;
  paymentFilter: string[];
  onPaymentFilterChange: (statuses: string[]) => void;
  orders: AdminOrder[];
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'on_hold'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'];

export const OrderFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  orders,
}: OrderFiltersProps) => {
  const handleStatusToggle = (status: string) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter((s) => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  const handlePaymentToggle = (status: string) => {
    if (paymentFilter.includes(status)) {
      onPaymentFilterChange(paymentFilter.filter((s) => s !== status));
    } else {
      onPaymentFilterChange([...paymentFilter, status]);
    }
  };

  const handleExport = () => {
    exportOrdersToCSV(orders);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Orders</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by order ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Order Status Filter */}
      <div className="space-y-3">
        <Label>Order Status</Label>
        <div className="space-y-2">
          {ORDER_STATUSES.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={statusFilter.includes(status)}
                onCheckedChange={() => handleStatusToggle(status)}
              />
              <label
                htmlFor={`status-${status}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {formatOrderStatus(status)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status Filter */}
      <div className="space-y-3">
        <Label>Payment Status</Label>
        <div className="space-y-2">
          {PAYMENT_STATUSES.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`payment-${status}`}
                checked={paymentFilter.includes(status)}
                onCheckedChange={() => handlePaymentToggle(status)}
              />
              <label
                htmlFor={`payment-${status}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {formatPaymentStatus(status)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <Button onClick={handleExport} className="w-full" variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export to CSV
      </Button>
    </div>
  );
};
