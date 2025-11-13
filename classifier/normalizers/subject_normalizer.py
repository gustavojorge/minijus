import re
from utils.logger import get_logger

logger = get_logger()

_PUNCT_RE = re.compile(r"[\.,;:!\?\-_/\\]+")
_MULTISPACE_RE = re.compile(r"\s+")

def normalize_subject(text: str) -> str:
	logger.info(f"Normalizing subject: {text}")

	if not text:
		return ""
	text = text.lower().strip()
	replacements = {
		"ã": "a", "õ": "o", "â": "a", "ê": "e", "ô": "o", "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
		"à": "a", "ç": "c", "ü": "u", "î": "i", "ê": "e", "ô": "o", "û": "u"
	}
	text = "".join(replacements.get(ch, ch) for ch in text)
	text = _PUNCT_RE.sub(" ", text)
	text = _MULTISPACE_RE.sub(" ", text).strip()
	return text
