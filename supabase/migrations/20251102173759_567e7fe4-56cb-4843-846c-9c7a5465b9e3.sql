-- Fix privilege escalation vulnerability on profiles table
-- Drop the vulnerable policy that allows unrestricted updates
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a new restrictive policy that prevents role modifications
-- Users can update their personal information but NOT the role column
CREATE POLICY "Users can update own profile data"
ON public.profiles FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Ensure only admins can update roles through profiles table
-- (Note: roles should be managed via user_roles table instead)
CREATE POLICY "Admins can update user roles in profiles"
ON public.profiles FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));