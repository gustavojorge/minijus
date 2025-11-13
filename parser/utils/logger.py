import logging
import os
from datetime import datetime


def _default_log_dir() -> str:
    # 1) Environment override
    env_dir = os.getenv("PARSER_LOG_DIR")
    if env_dir:
        try:
            os.makedirs(env_dir, exist_ok=True)
            return env_dir
        except Exception:
            pass

    # 2) Project-local logs directory (next to this package)
    try:
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
        local_dir = os.path.join(base, "logs")
        os.makedirs(local_dir, exist_ok=True)
        return local_dir
    except Exception:
        pass

    # 3) /tmp fallback to ensure tests/environments without write perms still work
    tmp_dir = "/tmp/parser/logs"
    try:
        os.makedirs(tmp_dir, exist_ok=True)
    except Exception:
        # Last resort: return tmp_dir even if creation failed; handlers will fallback to StreamHandler
        pass
    return tmp_dir


def setup_logger(name: str = "parser", log_level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger(name)
    # Avoid adding duplicate handlers across multiple imports
    if logger.handlers:
        return logger

    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    log_dir = _default_log_dir()
    log_filename = f"parser_{datetime.now().strftime('%Y%m%d')}.log"
    log_filepath = os.path.join(log_dir, log_filename)

    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Try file handler first, then fallback to stream handler if file not writable
    try:
        file_handler = logging.FileHandler(log_filepath, encoding='utf-8')
        file_handler.setLevel(logger.level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception:
        stream = logging.StreamHandler()
        stream.setLevel(logger.level)
        stream.setFormatter(formatter)
        logger.addHandler(stream)

    return logger


default_logger = setup_logger()