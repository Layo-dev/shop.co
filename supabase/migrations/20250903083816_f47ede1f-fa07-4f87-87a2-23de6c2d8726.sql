-- Fix function search path issues for existing functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
    SELECT role FROM public.profiles WHERE user_id = user_uuid;
$function$;

CREATE OR REPLACE FUNCTION public.update_last_login(user_uuid uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
    UPDATE public.profiles 
    SET last_login = now() 
    WHERE user_id = user_uuid;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'customer')
    );
    RETURN NEW;
END;
$function$;

-- Enable RLS on backup tables that were created
ALTER TABLE products_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items_backup ENABLE ROW LEVEL SECURITY;

-- Add policies for backup tables (read-only for admins)
CREATE POLICY "Admins can view backup tables" 
ON products_backup FOR SELECT 
TO authenticated 
USING (get_user_role(auth.uid()) = 'admin'::app_role);

CREATE POLICY "Admins can view cart backup tables" 
ON cart_items_backup FOR SELECT 
TO authenticated 
USING (get_user_role(auth.uid()) = 'admin'::app_role);