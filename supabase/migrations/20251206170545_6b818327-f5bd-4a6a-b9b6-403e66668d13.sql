-- Drop the overly permissive INSERT policy on profiles
-- The handle_new_user() trigger with SECURITY DEFINER already handles 
-- profile creation during user signup, so this policy is redundant and creates a security hole
DROP POLICY IF EXISTS "System can insert profiles" ON profiles;