from __future__ import annotations
from datetime import datetime
from typing import Any, Dict, List

def _epoch_to_iso(epoch_val) -> str | None:
    if epoch_val in (None, "", 0):
        return None
    try:
        return datetime.utcfromtimestamp(int(epoch_val)).strftime("%Y-%m-%d")
    except Exception:
        return None
    
def transform_kb_to_es(raw: Dict[str, Any]) -> Dict[str, Any]:
    distribution_date = raw.get("distributionDate")
    date_iso = datetime.utcfromtimestamp(distribution_date).strftime("%Y-%m-%d") if distribution_date else None

    activities: List[Dict[str, Any]] = []
    for a in raw.get("activities", []):
        if not isinstance(a, dict):
            continue
        date_val = a.get("date")
        act_date = datetime.utcfromtimestamp(date_val).strftime("%Y-%m-%d") if date_val else None
        desc = a.get("description") or a.get("text")
        activities.append({
            "date": act_date,
            "description": desc,
        })

    related_people: List[Dict[str, Any]] = []
    for p in raw.get("relatedPeople", []):
        if not isinstance(p, dict):
            continue
        role_val = (p.get("role", {}).get("normalized") or p.get("role", {}).get("rawValue")) if p.get("role") else None
        related_people.append({"name": p.get("name"), "role": role_val})

    lawyers: List[Dict[str, Any]] = []
    for l in raw.get("representedPersonLawyers", []):
        if not isinstance(l, dict):
            continue
        lawyers.append({"name": l.get("name")})

    court = raw.get("court")
    if isinstance(court, dict):
        court_val = court.get("rawValue")
    else:
        court_val = court

    doc = {
        "number": raw.get("number"),
        "date": date_iso,
        "court": court_val,
        "judge": raw.get("judgeName"),
        "kind": raw.get("kind"),
        "lawyers": lawyers,
        "nature": raw.get("nature"),
        "related_people": related_people,
        "subject": raw.get("subject"),
        "value": raw.get("value"),
        "activities": activities,
    }
    return {k: v for k, v in doc.items() if v not in (None, [])}

def transform_db_row(row: Dict[str, Any]) -> Dict[str, Any]:
    distribution_date = row.get("distribution_date")
    if distribution_date:
        if isinstance(distribution_date, datetime):
            date_str = distribution_date.strftime("%Y-%m-%d")
        else:
            try:
                date_str = str(distribution_date).split(" ")[0]
            except Exception:
                date_str = None
    else:
        date_str = None

    related_people_raw = row.get("related_people") or []
    related_people: List[Dict[str, str]] = []
    for p in related_people_raw:
        if not isinstance(p, dict):
            continue
        role_obj = p.get("role")
        role_val = None
        if isinstance(role_obj, dict):
            role_val = role_obj.get("normalized") or role_obj.get("rawValue")
        else:
            role_val = role_obj
        related_people.append(
            {
                "name": p.get("name") if isinstance(p, dict) else None,
                "role": role_val,
            }
        )

    lawyers_raw = row.get("represented_person_lawyers") or []
    lawyers = []
    for l in lawyers_raw:
        if not isinstance(l, dict):
            continue
        lawyers.append({"name": l.get("name")})

    activities_raw = row.get("activities") or []
    activities: List[Dict[str, Any]] = []
    for a in activities_raw:
        if not isinstance(a, dict):
            continue
        desc = a.get("description") or a.get("text")
        activity_doc: Dict[str, Any] = {"description": desc}
        iso_date = _epoch_to_iso(a.get("date"))
        if iso_date:
            activity_doc["date"] = iso_date
        activities.append(activity_doc)

    value = row.get("value")
    try:
        value_float = float(value) if value is not None else None
    except (TypeError, ValueError):
        value_float = None

    doc = {
        "number": row.get("number"),
        "date": date_str,
        "court": row.get("court"),
        "judge": row.get("judge_name"),
        "kind": row.get("kind"),
        "lawyers": lawyers,
        "nature": row.get("nature"),
        "related_people": related_people,
        "subject": row.get("subject"),
        "value": value_float,
        "activities": activities,
    }
    return {k: v for k, v in doc.items() if v not in (None, [])}
