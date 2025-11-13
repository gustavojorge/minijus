-- depends: 001_create_table_lawsuits
-- upgrade
DO $$
DECLARE src_schema text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'lawsuits'
  ) THEN
    SELECT n.nspname INTO src_schema
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'lawsuits'
    LIMIT 1;

    IF src_schema IS NOT NULL AND src_schema <> 'public' THEN
      EXECUTE format('ALTER TABLE %I.lawsuits SET SCHEMA public', src_schema);
    ELSIF src_schema IS NULL THEN
      CREATE TABLE public.lawsuits (
          id SERIAL PRIMARY KEY,
          number VARCHAR NOT NULL UNIQUE,
          court VARCHAR,
          nature VARCHAR,
          kind VARCHAR,
          subject VARCHAR,
          sensitive_kind VARCHAR,
          distribution_date TIMESTAMP,
          judge_name VARCHAR,
          value NUMERIC,
          justice_secret BOOLEAN,
          court_instance NUMERIC,
          related_people JSONB,
          represented_person_lawyers JSONB,
          activities JSONB,
          documento_json JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    END IF;
  END IF;
END $$;
DO $$ BEGIN NULL; END $$;