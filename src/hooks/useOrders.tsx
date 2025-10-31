import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  shipping_address: any;
  billing_address: any;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  size?: string;
  color?: string;
  created_at: string;
  products?: {
    title: string;
    image_url: string;
    images: any;
    price: number;
  };
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              title,
              image_url,
              images,
              price
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    total_amount: number;
    shipping_address?: any;
    billing_address?: any;
    items: Array<{
      product_id: string;
      quantity: number;
      price_at_time: number;
      size?: string;
      color?: string;
    }>;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      console.log('createOrder called w/ user:', user.id, 'orderData:', orderData);
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
        })
        .select()
        .single();
      if (orderError) {
        console.error('Order insert failed:', orderError);
        throw orderError;
      }
      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      if (itemsError) {
        console.error('Order items insert failed:', itemsError);
        throw itemsError;
      }
      await fetchOrders();

      toast({
        title: "Order created",
        description: "Your order has been successfully created",
      });
      console.log('createOrder ALL DONE, order:', order);
      return order;
    } catch (error) {
      console.error('createOrder encounter error:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast({
        title: "Order updated",
        description: "Order status has been updated",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order?.status !== 'pending') {
        toast({
          title: "Error",
          description: "Only pending orders can be cancelled",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' as const } : order
        )
      );

      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const reorderItems = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order?.order_items) {
        throw new Error('Order items not found');
      }

      return order.order_items;
    } catch (error) {
      console.error('Error getting order items for reorder:', error);
      toast({
        title: "Error",
        description: "Failed to reorder items",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    reorderItems,
    refetchOrders: fetchOrders,
  };
};