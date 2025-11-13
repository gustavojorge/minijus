-- depends: 003_ensure_public_lawsuits
-- downgrade
DROP INDEX IF EXISTS idx_lawsuits_nature_kind;
DROP INDEX IF EXISTS idx_lawsuits_sensitive_kind;
DROP INDEX IF EXISTS idx_lawsuits_distribution_date;
