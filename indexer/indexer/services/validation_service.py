from __future__ import annotations
from typing import Dict, Any, Set, List
from pydantic import ValidationError as PydanticValidationError
from ..utils.config import load_settings
from ..models.kb_models import KBLawsuit 
from ..utils.logging_config import get_logger

logger = get_logger(__name__)
_settings_cache = load_settings()
_properties = _settings_cache["mappings"]["properties"]
REQUIRED_FIELDS: Set[str] = set(_properties.keys())

class ValidationError(ValueError):
    pass

def validate_es_document(doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Verifies if the transformed document has the required fields for indexing in ES:
    - number: not null/empty
    - activities: non-empty list
    """
    missing: List[str] = []
    number = doc.get('number')
    if not number:
        missing.append('number')

    activities = doc.get('activities')
    if not activities or not isinstance(activities, list) or len(activities) == 0:
        missing.append('activities')
    else:
        for idx, act in enumerate(activities):
            desc = act.get('description') if isinstance(act, dict) else None
            if not desc:
                missing.append(f'activities[{idx}].description')

    if missing:
        raise ValidationError(f"Invalid Document {number} - Missing required fields: {sorted(missing)}")
    return doc

def validate_raw_for_mapping(raw: Dict[str, Any], origin: str) -> None:
    """
    Verifies if the raw document has the required fields for indexing:
    - number: not null/empty
    - activities: non-empty list
    """
    missing: List[str] = []

    number = raw.get('number')
    if not number:
        missing.append('number')

    activities = raw.get('activities')
    if not activities or not isinstance(activities, list) or len(activities) == 0:
        missing.append('activities')
    else:
        for idx, act in enumerate(activities):
            desc = act.get('description') if isinstance(act, dict) else None
            if desc is None:
                desc = act.get('text') if isinstance(act, dict) else None
            if not desc:
                missing.append(f'activities[{idx}].description')

    secret = None
    if origin == 'db':
        secret = raw.get('justice_secret')
    else:
        secret = raw.get('justiceSecret')
    if secret is True:
        logger.warning(f"Validation Error (Document {number}): Row skipped due to secret justice (Document not indexed).")
        raise ValidationError('Document labeled as justiceSecret=true; not indexed.')

    if missing:
        logger.warning(f"Validation Error (Document {number}): Row skipped due to insufficient data for mapping (Document not indexed). Missing: {sorted(missing)}")
        raise ValidationError(f'Insufficient data for mapping (origin={origin}). Missing: {sorted(missing)}')
    return None

