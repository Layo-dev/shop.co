-- Create storage policies for the cloth bucket

-- Allow public to view images in cloth bucket
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'cloth');

-- Allow admins to upload product images
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'cloth' 
  AND public.has_role(auth.uid(), 'admin')
  AND (storage.foldername(name))[1] = 'products'
);

-- Allow admins to update product images
CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'cloth' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'cloth' 
  AND public.has_role(auth.uid(), 'admin')
);