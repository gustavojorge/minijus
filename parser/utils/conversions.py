from datetime import datetime
from typing import Any, Optional
from utils.logger import default_logger as logger

def to_timestamp(date_str: Optional[str]) -> Optional[int]:
	if not date_str:
		return None
	try:
		dt = datetime.strptime(date_str, "%Y-%m-%d")
		return int(dt.timestamp())
	except Exception:
		return None

def to_float(value: Any) -> Optional[float]:
	if value is None or value == "":
		logger.warning(f"Failed to convert to float: {value}")
		return None
	if isinstance(value, bool): 
		return None
	if isinstance(value, (int, float)):
		return float(value)
	try:
		return float(str(value).strip())
	except (ValueError, TypeError):
		return None

def to_int(value: Any) -> Optional[int]:
	if value is None or value == "":
		logger.warning(f"Failed to int: {value}")
		return None
	if isinstance(value, int) and not isinstance(value, bool): 
		return value
	try:
		return int(str(value))
	except Exception:
		return None

