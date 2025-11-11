import json
from pathlib import Path
from typing import Any, Dict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RESOURCES_DIR = BASE_DIR / "resources"
SETTINGS_PATH = RESOURCES_DIR / "index.json"
INDEX_NAME = "lawsuits"

def load_settings() -> Dict[str, Any]:
    return json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
