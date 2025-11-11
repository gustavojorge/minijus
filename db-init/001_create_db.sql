CREATE TABLE lawsuits (
            id SERIAL PRIMARY KEY,
            number VARCHAR(255) NOT NULL,
            court VARCHAR(255),
            nature VARCHAR(255),
            kind VARCHAR(255),
            subject VARCHAR(255),
            sensitive_kind VARCHAR(255),
            distribution_date TIMESTAMP,
            judge_name VARCHAR(255),
            value NUMERIC,
            justice_secret BOOLEAN,
            court_instance NUMERIC,
            related_people JSONB,
            represented_person_lawyers JSONB,
            activities JSONB,
            documento_json JSONB,
            UNIQUE (number, court_instance)
        )