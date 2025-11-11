import logging
import os
from pathlib import Path

def setup_logging(
    level: str = "INFO",
    log_file: str = "logs/app.log",
    console: bool = True
) -> None:

    env_level = os.getenv("LOG_LEVEL")
    if env_level:
        level = env_level
    log_level = getattr(logging, level.upper(), logging.INFO)
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(name)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    if log_file:
        log_file = os.getenv("LOG_FILE", log_file)
        log_path = Path(log_file)
        if not log_path.is_absolute():
            project_root = Path(__file__).resolve().parents[2]
            log_path = project_root / log_path
        log_path.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_path, encoding='utf-8')
        file_handler.setFormatter(formatter)
        file_handler.setLevel(log_level)
        root_logger.addHandler(file_handler)

    if console:
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        console_handler.setLevel(log_level)
        root_logger.addHandler(console_handler)

    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
