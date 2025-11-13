import logging
import os
from datetime import datetime


def _default_log_dir() -> str:
    # 1) Respect environment override
    env_dir = os.getenv("DB_SYNC_LOG_DIR")
    if env_dir:
        return env_dir

    # 2) Container path used in docker-compose volume mapping
    container_dir = "/db_sync/logs"
    try:
        os.makedirs(container_dir, exist_ok=True)
        # If we can create/access it, use it
        return container_dir
    except Exception:
        pass

    # 3) Fallback to project-local logs directory
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "logs"))
    try:
        os.makedirs(base_dir, exist_ok=True)
        return base_dir
    except Exception:
        pass

    # 4) Final fallback to tmp
    tmp_dir = "/tmp/db_sync/logs"
    os.makedirs(tmp_dir, exist_ok=True)
    return tmp_dir


_LOG_DIR = _default_log_dir()

_log_filename = os.path.join(_LOG_DIR, f"db_sync_{datetime.utcnow().strftime('%Y%m%d')}.log")

_logger = logging.getLogger("db_sync")
if not _logger.handlers:
    _logger.setLevel(logging.INFO)

    fmt = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

    try:
        fh = logging.FileHandler(_log_filename)
        fh.setFormatter(fmt)
        fh.setLevel(logging.INFO)
        _logger.addHandler(fh)
    except Exception:
        # If file handler fails, proceed with console-only logging
        pass

    ch = logging.StreamHandler()
    ch.setFormatter(fmt)
    ch.setLevel(logging.INFO)
    _logger.addHandler(ch)


def get_logger() -> logging.Logger:
    return _logger
