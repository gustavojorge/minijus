-- depends:
-- upgrade
CREATE TABLE IF NOT EXISTS public.lawsuits (
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