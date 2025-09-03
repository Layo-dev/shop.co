-- First, backup existing data if any exists
CREATE TABLE IF NOT EXISTS products_backup AS SELECT * FROM products;
CREATE TABLE IF NOT EXISTS cart_items_backup AS SELECT * FROM cart_items;

-- Drop existing tables to recreate with proper structure
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with proper structure
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  subcategory TEXT,
  style TEXT,
  material TEXT,
  care TEXT,
  in_stock BOOLEAN DEFAULT true,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table with proper structure
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size TEXT,
  color TEXT,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subcategory ON products(subcategory);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_title_description ON products USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view products" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can view products" 
ON products FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can manage products" 
ON products FOR ALL 
TO authenticated 
USING (get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::app_role);

-- Cart Items RLS Policies (user-specific access)
CREATE POLICY "Users can view their own cart items" 
ON cart_items FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own cart items" 
ON cart_items FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own cart items" 
ON cart_items FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own cart items" 
ON cart_items FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products from your frontend data
INSERT INTO products (title, description, price, original_price, discount, rating, reviews, category, subcategory, style, image_url, colors, sizes, in_stock) VALUES
('T-shirt with Tape Details', 'This t-shirt is perfect for casual wear with its comfortable fit and stylish tape details.', 120.00, null, 0, 4.5, 120, 'Casual', 'T-Shirts', 'casual', '/placeholder.svg', '["Black", "White", "Gray"]'::jsonb, '["Small", "Medium", "Large", "X-Large"]'::jsonb, true),
('Skinny Fit Jeans', 'High-quality skinny fit jeans perfect for a modern look.', 240.00, 260.00, 20, 3.5, 85, 'Casual', 'Jeans', 'casual', '/placeholder.svg', '["Blue", "Black", "Gray"]'::jsonb, '["28", "30", "32", "34", "36"]'::jsonb, true),
('Checkered Shirt', 'Classic checkered shirt perfect for both casual and semi-formal occasions.', 180.00, null, 0, 4.5, 95, 'Casual', 'Shirts', 'casual', '/placeholder.svg', '["Red", "Blue", "Green"]'::jsonb, '["Small", "Medium", "Large", "X-Large"]'::jsonb, true),
('Sleeve Striped T-shirt', 'Comfortable striped t-shirt with a modern fit.', 130.00, 160.00, 30, 4.5, 210, 'Casual', 'T-Shirts', 'casual', '/placeholder.svg', '["Orange", "Blue", "White"]'::jsonb, '["Small", "Medium", "Large", "X-Large"]'::jsonb, true),
('Vertical Striped Shirt', 'Professional vertical striped shirt perfect for formal occasions.', 212.00, 232.00, 20, 5.0, 65, 'Formal', 'Shirts', 'formal', '/placeholder.svg', '["Blue", "White", "Gray"]'::jsonb, '["Small", "Medium", "Large", "X-Large"]'::jsonb, true),
('Courage Graphic T-shirt', 'Bold graphic t-shirt with inspirational design.', 145.00, null, 0, 4.0, 78, 'Casual', 'T-Shirts', 'casual', '/placeholder.svg', '["Black", "White", "Red"]'::jsonb, '["Small", "Medium", "Large", "X-Large"]'::jsonb, true),
('Loose Fit Bermuda Shorts', 'Comfortable loose fit shorts perfect for summer.', 80.00, null, 0, 3.0, 45, 'Casual', 'Shorts', 'casual', '/placeholder.svg', '["Khaki", "Navy", "Black"]'::jsonb, '["28", "30", "32", "34", "36"]'::jsonb, true),
('Faded Skinny Jeans', 'Trendy faded skinny jeans with a modern cut.', 210.00, null, 0, 4.5, 156, 'Casual', 'Jeans', 'casual', '/placeholder.svg', '["Blue", "Light Blue", "Black"]'::jsonb, '["28", "30", "32", "34", "36"]'::jsonb, true);