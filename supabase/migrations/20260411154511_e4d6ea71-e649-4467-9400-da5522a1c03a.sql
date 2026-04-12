DROP POLICY "Anyone can insert customers" ON public.customers;

CREATE POLICY "Anyone can insert customers" ON public.customers
FOR INSERT WITH CHECK (
  length(trim(name)) > 0 AND length(trim(phone)) > 0
);

-- Also drop the duplicate SELECT policy (admins already have access)
DROP POLICY "Anyone can check payment by phone" ON public.customers;