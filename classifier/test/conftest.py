import logging
import pytest

@pytest.fixture(autouse=True)
def patch_classifier_logger(monkeypatch):
    logger = logging.getLogger("classifier-test")
    logger.handlers[:] = []
    logger.setLevel(logging.DEBUG)
    stream = logging.StreamHandler()
    formatter = logging.Formatter('%(levelname)s:%(message)s')
    stream.setFormatter(formatter)
    logger.addHandler(stream)

    from utils import logger as logger_module
    monkeypatch.setattr(logger_module, "get_logger", lambda: logger, raising=False)
    return logger
