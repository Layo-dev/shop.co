import { Order } from '@/hooks/useOrders';

// Format order number (last 8 chars uppercase)
export const formatOrderNumber = (id: string) => `#${id.slice(-8).toUpperCase()}`;

// Get status badge color for order status
export const getOrderStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    on_hold: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

// Get status badge color for payment status
export const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    partially_refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

// Format currency in Naira
export const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Export orders to CSV
export const exportOrdersToCSV = (orders: any[]) => {
  const headers = [
    'Order ID',
    'Customer Name',
    'Customer Email',
    'Items Count',
    'Total Amount',
    'Payment Status',
    'Payment Method',
    'Order Status',
    'Shipping Carrier',
    'Tracking Number',
    'Created At',
    'Notes'
  ];

  const rows = orders.map(order => [
    formatOrderNumber(order.id),
    order.customer_name || 'N/A',
    order.customer_email || 'N/A',
    order.items_count || 0,
    order.total_amount,
    order.payment_status || 'pending',
    order.payment_method || 'N/A',
    order.status,
    order.shipping_carrier || 'N/A',
    order.tracking_number || 'N/A',
    new Date(order.created_at).toLocaleString(),
    order.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Calculate refundable amount
export const getRefundableAmount = (order: any) => {
  const refundedAmount = order.refund_amount || 0;
  return Math.max(0, order.total_amount - refundedAmount);
};

// Format order status for display
export const formatOrderStatus = (status: string) => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Format payment status for display
export const formatPaymentStatus = (status: string) => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Format date for display
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
