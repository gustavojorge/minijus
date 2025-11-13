import logging
import os
import sys
import pytest
from contextlib import contextmanager
from importlib import import_module

_HERE = os.path.dirname(__file__)
_ROOT = os.path.abspath(os.path.join(_HERE, os.pardir))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

_PARSER_ROOT = os.path.join(_ROOT, "parser")
_CLASSIFIER_ROOT = os.path.join(_ROOT, "classifier")
_DB_SYNC_ROOT = os.path.join(_ROOT, "db_sync")
_PRODUCER_ROOT = os.path.join(_ROOT, "initial_payload_producer")
for p in (_PARSER_ROOT, _CLASSIFIER_ROOT, _DB_SYNC_ROOT, _PRODUCER_ROOT):
    if p not in sys.path:
        sys.path.insert(0, p)

@pytest.fixture(autouse=True)
def patch_all_loggers(monkeypatch):
    logger = logging.getLogger("pipeline-test")
    logger.handlers[:] = []
    logger.setLevel(logging.DEBUG)
    stream = logging.StreamHandler()
    formatter = logging.Formatter('%(levelname)s:%(message)s')
    stream.setFormatter(formatter)
    logger.addHandler(stream)

    # Patch parser logger
    try:
        from parser.utils import logger as p_logger
        monkeypatch.setattr(p_logger, "default_logger", logger, raising=False)
    except Exception:
        pass

    # Patch classifier logger
    try:
        from classifier.utils import logger as c_logger
        monkeypatch.setattr(c_logger, "get_logger", lambda: logger, raising=False)
    except Exception:
        pass

    # Patch db_sync logger
    try:
        from db_sync.utils import logger as d_logger
        monkeypatch.setattr(d_logger, "get_logger", lambda: logger, raising=False)
    except Exception:
        pass

    return logger


class DummyProducer:
    def __init__(self, sink):
        self.sink = sink

    async def send_and_wait(self, topic, value):
        self.sink.append((topic, value))

    async def stop(self):
        pass

class DummyConsumer:
    def __init__(self, messages):
        self._messages = messages

    def __aiter__(self):
        async def gen():
            for m in self._messages:
                yield m
        return gen()

    async def start(self):
        return None

    async def stop(self):
        return None


class Msg:
    def __init__(self, value):
        self.value = value

class _DummyAIOKafkaConsumer:
    def __init__(self, *args, **kwargs):
        pass

    async def start(self):
        pass

    async def stop(self):
        pass


class _DummyAIOKafkaProducer:
    def __init__(self, *args, **kwargs):
        pass

    async def start(self):
        pass

    async def stop(self):
        pass


class _AiokafkaModule:
    AIOKafkaConsumer = _DummyAIOKafkaConsumer
    AIOKafkaProducer = _DummyAIOKafkaProducer


sys.modules.setdefault("aiokafka", _AiokafkaModule())

class _DummyAsyncpgModule:
    class Pool:
        pass

    async def create_pool(*args, **kwargs):
        raise RuntimeError("create_pool should be patched in tests")


sys.modules.setdefault("asyncpg", _DummyAsyncpgModule())


@contextmanager
def module_aliases_for(app: str):
    to_set = {}
    if app == "parser":
        to_set = {
            "utils": import_module("parser.utils"),
            "utils.logger": import_module("parser.utils.logger"),
            "normalizers": import_module("parser.normalizers"),
            "transformers": import_module("parser.transformers"),
        }
    elif app == "classifier":
        to_set = {
            "utils": import_module("classifier.utils"),
            "utils.logger": import_module("classifier.utils.logger"),
            "classifiers": import_module("classifier.classifiers"),
            "normalizers": import_module("classifier.normalizers"),
            "config": import_module("classifier.config"),
        }
    elif app == "db_sync":
        to_set = {
            "utils": import_module("db_sync.utils"),
            "utils.logger": import_module("db_sync.utils.logger"),
            "storage": import_module("db_sync.storage"),
        }
    prev = {}
    try:
        for name, mod in to_set.items():
            prev[name] = sys.modules.get(name)
            sys.modules[name] = mod
        yield
    finally:
        for name, old in prev.items():
            if old is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = old
