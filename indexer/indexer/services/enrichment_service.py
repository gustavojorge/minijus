from __future__ import annotations
from typing import Dict, Any
from ..utils.transformers import transform_db_row, transform_kb_to_es
from .validation_service import validate_es_document, ValidationError
from ..utils.logging_config import get_logger
from .normalization import normalize_document

logger = get_logger(__name__)


def enrichment(raw: Dict[str, Any], origin: str) -> Dict[str, Any]:
    if origin == "http_request":
        doc = transform_kb_to_es(raw)
    elif origin == "db":
        doc = transform_db_row(raw)
    else:
        raise ValidationError(f"Unknown source: {origin}")

    doc = normalize_document(doc)

    validate_es_document(doc)
    return doc

