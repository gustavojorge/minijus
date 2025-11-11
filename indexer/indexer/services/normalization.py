from __future__ import annotations
import unicodedata
from typing import Optional, Dict, Any
from indexer.utils.logging_config import get_logger

logger = get_logger(__name__)

def strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")

def normalize_court(value: Optional[str]) -> Optional[str]:
    if not value:
        return value
    value = value.strip()
    value = strip_accents(value)
    return value.upper()

def normalize_scalar(text: Optional[str]) -> Optional[str]:
    if text is None:
        return None
    return text.strip()

def normalize_document(doc: Dict[str, Any]) -> Dict[str, Any]:

    doc["court"] = normalize_court(doc.get("court"))
    
    for field in ("judge", "nature", "subject", "kind"):
        if field in doc:
            before_val = doc.get(field)
            doc[field] = normalize_scalar(before_val)
            if before_val != doc[field]:
                logger.debug("Normalized field %s: '%s' -> '%s'", field, before_val, doc[field])
    return doc
