import uuid
from typing import Any, Dict, List, Tuple
from normalizers.person import normalize_person_name
from model import RelatedPerson, RepresentedPersonLawyer, Role

def extract_parts(record: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    parts_raw: List[Dict[str, Any]] = record.get("partes_do_processo", []) or []
    related_people: List[Dict[str, Any]] = []
    represented_lawyers: List[Dict[str, Any]] = []

    for part in parts_raw:
        part_id = str(uuid.uuid4())
        name_raw = part.get("nome", "")
        role_raw = part.get("papel", "")
        role_norm = normalize_person_name(role_raw)
        author_flag = role_raw.strip().lower() in {"autor", "autora", "requerente"}

        rp_model = RelatedPerson(
            id=part_id,
            nameRaw=name_raw,
            name=normalize_person_name(name_raw),
            role=Role(rawValue=role_raw, normalized=role_norm),
            author=author_flag,
        )
        related_people.append(rp_model.model_dump())

        lawyers = part.get("advogado(as)") or []
        if isinstance(lawyers, list):
            for lw in lawyers:
                lw_model = RepresentedPersonLawyer(
                    nameRaw=lw,
                    name=normalize_person_name(lw, is_lawyer=True),
                    representedPersonId=part_id,
                )
                represented_lawyers.append(lw_model.model_dump())

    return related_people, represented_lawyers
