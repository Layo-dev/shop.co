import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminOrder {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  total_amount: number;
  shipping_carrier?: string;
  tracking_number?: string;
  notes?: string;
  refund_amount?: number;
  refund_reason?: string;
  shipping_address: any;
  billing_address: any;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  items_count?: number;
  order_items?: any[];
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with customer profiles
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get user profiles and order details
      const ordersWithDetails = await Promise.all(
        (ordersData || []).map(async (order) => {
          // Get profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, user_id')
            .eq('user_id', order.user_id)
            .single();

          // Count order items
          const { count } = await supabase
            .from('order_items')
            .select('*', { count: 'exact', head: true })
            .eq('order_id', order.id);

          // Get user email
          const { data: authData } = await supabase.auth.admin.getUserById(order.user_id);

          return {
            ...order,
            customer_name: profile 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown'
              : 'Unknown',
            customer_email: authData?.user?.email || 'N/A',
            items_count: count || 0,
          };
        })
      );

      setOrders(ordersWithDetails as AdminOrder[]);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer_name?.toLowerCase().includes(query) ||
          order.customer_email?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((order) => statusFilter.includes(order.status));
    }

    // Payment status filter
    if (paymentFilter.length > 0) {
      filtered = filtered.filter((order) => paymentFilter.includes(order.payment_status));
    }

    return filtered;
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: status as any, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: status as any } : order))
      );

      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus as any, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, payment_status: paymentStatus as any } : order))
      );

      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  const addShippingInfo = async (orderId: string, carrier: string, trackingNumber: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          shipping_carrier: carrier,
          tracking_number: trackingNumber,
          status: 'shipped' as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, shipping_carrier: carrier, tracking_number: trackingNumber, status: 'shipped' as any }
            : order
        )
      );

      toast({
        title: 'Success',
        description: 'Shipping information added successfully',
      });
    } catch (error: any) {
      console.error('Error adding shipping info:', error);
      toast({
        title: 'Error',
        description: 'Failed to add shipping information',
        variant: 'destructive',
      });
    }
  };

  const refundOrder = async (orderId: string, amount: number, reason: string) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error('Order not found');

      const totalRefunded = (order.refund_amount || 0) + amount;
      const isFullRefund = totalRefunded >= order.total_amount;

      const { error } = await supabase
        .from('orders')
        .update({
          refund_amount: totalRefunded,
          refund_reason: reason,
          payment_status: (isFullRefund ? 'refunded' : 'partially_refunded') as any,
          status: (isFullRefund ? 'refunded' : order.status) as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                refund_amount: totalRefunded,
                refund_reason: reason,
                payment_status: isFullRefund ? 'refunded' : 'partially_refunded',
                status: isFullRefund ? 'refunded' : o.status,
              }
            : o
        )
      );

      toast({
        title: 'Success',
        description: 'Refund processed successfully',
      });
    } catch (error: any) {
      console.error('Error processing refund:', error);
      toast({
        title: 'Error',
        description: 'Failed to process refund',
        variant: 'destructive',
      });
    }
  };

  const updateNotes = async (orderId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, notes } : order))
      );

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
    }
  };

  useEffect(() => {
    fetchAllOrders();

    // Real-time subscription
    const channel = supabase
      .channel('admin-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchAllOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    orders: filterOrders(),
    allOrders: orders,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    updateOrderStatus,
    updatePaymentStatus,
    addShippingInfo,
    refundOrder,
    updateNotes,
    refetchOrders: fetchAllOrders,
  };
};
