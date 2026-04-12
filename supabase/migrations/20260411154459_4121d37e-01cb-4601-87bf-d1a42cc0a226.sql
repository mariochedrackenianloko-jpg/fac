-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: Only admins can read user_roles
CREATE POLICY "Admins can read roles" ON public.user_roles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Product settings (single row config table)
CREATE TABLE public.product_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Formation Arts Cosmétiques',
    description TEXT NOT NULL DEFAULT '',
    price TEXT NOT NULL DEFAULT '9 900 FCFA',
    cover_image_url TEXT,
    ebook_file_url TEXT,
    wave_payment_link TEXT NOT NULL DEFAULT '',
    whatsapp_group_link TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.product_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product settings" ON public.product_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can update product settings" ON public.product_settings
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert product settings" ON public.product_settings
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Customers table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read customers" ON public.customers
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update customers" ON public.customers
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert customers" ON public.customers
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can check payment by phone" ON public.customers
FOR SELECT USING (true);

-- Storage bucket for ebook files and cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('ebooks', 'ebooks', true);

CREATE POLICY "Anyone can read ebook files" ON storage.objects
FOR SELECT USING (bucket_id = 'ebooks');

CREATE POLICY "Admins can upload ebook files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'ebooks' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ebook files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'ebooks' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ebook files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'ebooks' AND public.has_role(auth.uid(), 'admin'));

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_product_settings_updated_at
BEFORE UPDATE ON public.product_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default product settings row
INSERT INTO public.product_settings (title, description, price, wave_payment_link, whatsapp_group_link)
VALUES (
    'De zéro à expert : fabriquer et vendre ses cosmétiques & savons naturels',
    'Guide complet pour maîtriser la fabrication de cosmétiques naturels et lancer votre business en Afrique.',
    '9 900 FCFA',
    '',
    ''
);