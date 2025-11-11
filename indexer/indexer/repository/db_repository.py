from __future__ import annotations
import os
from typing import Any, Dict, List
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_conn():
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = int(os.getenv("POSTGRES_PORT", "5432"))
    db = os.getenv("POSTGRES_DB", "postgres")
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    return psycopg2.connect(
        host=host,
        port=port,
        dbname=db,
        user=user,
        password=password,
        cursor_factory=RealDictCursor,
    )

def fetch_lawsuits(conn) -> List[Dict[str, Any]]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, number, court, nature, kind, subject, distribution_date, judge_name, value,
                   justice_secret, court_instance, related_people, represented_person_lawyers, activities
            FROM lawsuits
            ORDER BY id
            """
        )
        return cur.fetchall()
