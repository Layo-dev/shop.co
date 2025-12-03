-- Function to check if user can review a product (purchased + delivered + not already reviewed)
CREATE OR REPLACE FUNCTION public.can_review_product(_user_id uuid, _product_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.user_id = _user_id 
      AND oi.product_id = _product_id
      AND o.status = 'delivered'
  ) AND NOT EXISTS (
    SELECT 1 
    FROM product_reviews pr
    WHERE pr.user_id = _user_id 
      AND pr.product_id = _product_id
  )
$$;

-- Policy to allow reading profile names for reviewers (for displaying reviewer names)
CREATE POLICY "Allow reading reviewer names for reviews"
ON profiles FOR SELECT
USING (
  user_id IN (SELECT user_id FROM product_reviews)
  OR auth.uid() = user_id
  OR has_role(auth.uid(), 'admin')
);

-- Storage policy for review images
CREATE POLICY "Users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cloth' AND 
  (storage.foldername(name))[1] = 'reviews' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Public read access for review images
CREATE POLICY "Anyone can view review images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cloth' AND 
  (storage.foldername(name))[1] = 'reviews'
);