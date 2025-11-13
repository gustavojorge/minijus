-- depends: 003_ensure_public_lawsuits

-- upgrade
CREATE INDEX IF NOT EXISTS idx_lawsuits_distribution_date
  ON public.lawsuits (distribution_date);

CREATE INDEX IF NOT EXISTS idx_lawsuits_sensitive_kind
  ON public.lawsuits (sensitive_kind);

CREATE INDEX IF NOT EXISTS idx_lawsuits_nature_kind
  ON public.lawsuits (nature, kind);
