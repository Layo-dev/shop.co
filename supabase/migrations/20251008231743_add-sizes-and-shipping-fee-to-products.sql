-- Add sizes as a text array and shipping_fee as numeric to products table
ALTER TABLE products ADD COLUMN sizes text[];
ALTER TABLE products ADD COLUMN shipping_fee numeric;
