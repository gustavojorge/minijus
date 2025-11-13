-- depends: 003_ensure_public_lawsuits
-- downgrade
DROP TRIGGER IF EXISTS trg_lawsuits_updated_at ON public.lawsuits;
DROP FUNCTION IF EXISTS public.lawsuits_set_updated_at();
