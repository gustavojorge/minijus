import logging
import os
from datetime import datetime

def _default_log_dir() -> str:
    env_dir = os.getenv("CLASSIFIER_LOG_DIR")
    if env_dir:
        try:
            os.makedirs(env_dir, exist_ok=True)
            return env_dir
        except Exception:
            pass

    try:
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
        local_dir = os.path.join(base, "logs")
        os.makedirs(local_dir, exist_ok=True)
        return local_dir
    except Exception:
        pass

    tmp_dir = "/tmp/classifier/logs"
    try:
        os.makedirs(tmp_dir, exist_ok=True)
    except Exception:
        pass
    return tmp_dir

_logger = logging.getLogger("classifier")
if not _logger.handlers:
    _logger.setLevel(logging.INFO)
    fmt = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

    log_dir = _default_log_dir()
    log_filename = os.path.join(log_dir, f"classifier_{datetime.utcnow().strftime('%Y%m%d')}.log")

    try:
        fh = logging.FileHandler(log_filename)
        fh.setFormatter(fmt)
        fh.setLevel(logging.INFO)
        _logger.addHandler(fh)
    except Exception:
        pass

    ch = logging.StreamHandler()
    ch.setFormatter(fmt)
    ch.setLevel(logging.INFO)
    _logger.addHandler(ch)


def get_logger() -> logging.Logger:
    return _logger
