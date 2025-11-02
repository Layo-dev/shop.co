-- Create payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');

-- Add new columns to orders table for admin order management
ALTER TABLE public.orders
  ADD COLUMN payment_status payment_status DEFAULT 'pending',
  ADD COLUMN payment_method text,
  ADD COLUMN shipping_carrier text,
  ADD COLUMN tracking_number text,
  ADD COLUMN notes text,
  ADD COLUMN refund_amount numeric DEFAULT 0,
  ADD COLUMN refund_reason text;

-- Admin can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
TO public
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update all orders
CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can view all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items FOR SELECT
TO public
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update all order items
CREATE POLICY "Admins can update all order items"
ON public.order_items FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));