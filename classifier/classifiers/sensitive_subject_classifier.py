from __future__ import annotations

from typing import Optional, Dict, Any
from model import ClassifiedLawsuitBase, ClassifiedLawsuit
from normalizers.subject_normalizer import normalize_subject
from config.sensitive_patterns import COMPILED_PATTERNS as _COMPILED
from utils.logger import get_logger

logger = get_logger()

def classify_sensitive_kind(subject: Optional[str]) -> Optional[str]:
	if not subject:
		return None
	norm = normalize_subject(subject)
	if not norm:
		return None
	for kind, patterns in _COMPILED.items():
		for pat in patterns:
			if pat.search(norm):
				return kind
	return None


def sensitive_kind(record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
	try:
		ClassifiedLawsuitBase(
			number=record.get("number", ""),
			subject=record.get("subject"),
		)
	except Exception as e:
		logger.warning("Discarding record due to validation error number=%s error=%s", record.get("number"), e)
		return None

	kind = classify_sensitive_kind(record.get("subject"))
	logger.info(
		"Classifying case %s subject=%s sensitiveKind=%s",
		record.get("number"),
		record.get("subject"),
		kind,
	)
	record["sensitiveKind"] = kind
	return record

__all__ = [
	"classify_sensitive_kind",
	"sensitive_kind",
]

