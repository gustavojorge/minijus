import os
import time
import traceback
import psycopg2
from utils.logger import get_logger

logger = get_logger()

def _build_db_url() -> str:
    user = os.getenv("PG_USER", "postgres")
    password = os.getenv("PG_PASSWORD", "postgres")
    host = os.getenv("PG_HOST", "postgres")
    port = os.getenv("PG_PORT", "5432")
    db = os.getenv("PG_DATABASE", "postgres")
    return f"postgresql://{user}:{password}@{host}:{port}/{db}"

def _should_run_migrations() -> bool:
    return os.getenv("RUN_MIGRATIONS", "true").lower() in {"1", "true", "yes", "on"}

def _debug_enabled() -> bool:
    return os.getenv("MIGRATIONS_DEBUG", "false").lower() in {"1", "true", "yes", "on"}

def _log_migrations_path(migrations_path: str) -> None:
    try:
        exists = os.path.isdir(migrations_path)
        logger.info("Migrations path: %s exists=%s", migrations_path, exists)
        if exists and _debug_enabled():
            files = sorted(os.listdir(migrations_path))
            logger.info("Migration files found (%d): %s", len(files), ", ".join(files))
    except Exception:
        logger.warning("Failed to inspect migrations directory", exc_info=True)

def _check_table_exists(schema: str, table: str) -> bool:
    url = _build_db_url()
    try:
        conn = psycopg2.connect(url)
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.tables
                        WHERE table_schema = %s AND table_name = %s
                    )
                    """,
                    (schema, table),
                )
                exists = cur.fetchone()[0]
                return bool(exists)
        finally:
            conn.close()
    except Exception:
        if _debug_enabled():
            logger.warning("Failed to check existence of table %s.%s", schema, table, exc_info=True)
        return False

def apply_migrations() -> None:

    if not _should_run_migrations():
        logger.info("RUN_MIGRATIONS disabled; skipping yoyo apply")
        return

    try:
        from yoyo import read_migrations, get_backend
    except Exception as e:
        logger.error("Yoyo not available to apply migrations automatically: %s", e)
        return

    migrations_path = os.path.join(os.path.dirname(__file__), "migrations")
    if not os.path.isdir(migrations_path):
        migrations_path = os.path.join(os.getcwd(), "migrations")

    _log_migrations_path(migrations_path)

    db_url = _build_db_url()
    retries = int(os.getenv("MIGRATIONS_RETRIES", "15"))
    delay = float(os.getenv("MIGRATIONS_DELAY", "2"))

    for attempt in range(1, retries + 1):
        try:
            backend = get_backend(db_url)
            with backend.lock():
                migrations = read_migrations(migrations_path)
                to_apply = list(backend.to_apply(migrations))

                if _debug_enabled():
                    names = [m.id for m in to_apply]
                    logger.info("Pending migrations (%d): %s", len(names), ", ".join(names))

                if not to_apply:
                    logger.info("No pending migrations (path=%s)", migrations_path)
                else:
                    backend.apply_migrations(to_apply)
                    logger.info("%d migration(s) applied", len(to_apply))

            exists = _check_table_exists("public", "lawsuits")
            logger.info("Does table public.lawsuits exist after migrations? %s", exists)
            break

        except Exception as e:
            if attempt == retries:
                logger.error("Failed to apply migrations after %d attempts: %s", attempt, e)
                if _debug_enabled():
                    logger.error("Stacktrace:\n%s", traceback.format_exc())
                return
            logger.warning("Database not ready yet (%s). Attempt %d/%d. Waiting %.1fs...", e, attempt, retries, delay)
            time.sleep(delay)
