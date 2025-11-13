import logging
import os
import types
import pytest


@pytest.fixture(autouse=True)
def patch_parser_logger(monkeypatch):
    """Patch parser default logger to a simple StreamHandler to avoid file I/O during tests."""
    logger = logging.getLogger("parser-test")
    logger.handlers[:] = []
    logger.setLevel(logging.DEBUG)
    stream = logging.StreamHandler()
    formatter = logging.Formatter('%(levelname)s:%(message)s')
    stream.setFormatter(formatter)
    logger.addHandler(stream)

    from utils import logger as logger_module
    monkeypatch.setattr(logger_module, "default_logger", logger, raising=False)
    return logger
