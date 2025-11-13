from typing import Any, Dict, List
from utils.conversions import to_timestamp
from model import Activity

def extract_activities(record: Dict[str, Any]) -> List[Dict[str, Any]]:
    activities_raw: List[Dict[str, Any]] = record.get("lista_das_movimentacoes", []) or []
    activities: List[Dict[str, Any]] = []
    for mov in activities_raw:
        act_model = Activity(
            date=to_timestamp(mov.get("data")),
            text=mov.get("movimento", ""),
        )
        activities.append(act_model.model_dump())
    return activities
