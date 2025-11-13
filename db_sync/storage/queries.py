UPSERT_LAWSUIT_SQL = """
INSERT INTO lawsuits (
    number, court, nature, kind, subject, sensitive_kind,
    distribution_date, judge_name, value, justice_secret, court_instance,
    related_people, represented_person_lawyers, activities, documento_json
) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11,
    $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb
)
ON CONFLICT (number) DO UPDATE SET
    court = EXCLUDED.court,
    nature = EXCLUDED.nature,
    kind = EXCLUDED.kind,
    subject = EXCLUDED.subject,
    sensitive_kind = EXCLUDED.sensitive_kind,
    distribution_date = EXCLUDED.distribution_date,
    judge_name = EXCLUDED.judge_name,
    value = EXCLUDED.value,
    justice_secret = EXCLUDED.justice_secret,
    court_instance = EXCLUDED.court_instance,
    related_people = EXCLUDED.related_people,
    represented_person_lawyers = EXCLUDED.represented_person_lawyers,
    activities = EXCLUDED.activities,
    documento_json = EXCLUDED.documento_json;
"""
