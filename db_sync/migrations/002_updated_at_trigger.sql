-- depends: 003_ensure_public_lawsuits
-- upgrade
CREATE OR REPLACE FUNCTION public.lawsuits_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lawsuits') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'trg_lawsuits_updated_at'
        ) THEN
            CREATE TRIGGER trg_lawsuits_updated_at
            BEFORE UPDATE ON public.lawsuits
            FOR EACH ROW EXECUTE FUNCTION public.lawsuits_set_updated_at();
        END IF;
    END IF;
END; $$;