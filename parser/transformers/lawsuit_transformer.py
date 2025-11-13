from typing import Any, Dict, Optional
from utils.conversions import to_float, to_int, to_timestamp
from utils.logger import default_logger as logger
from normalizers.person import normalize_person_name
from .parts_transformer import extract_parts
from .activities_transformer import extract_activities
from model import Lawsuit, Court

def transform(record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not record.get("existe", True):
        logger.info(f"Discarding record with existe=false: {record.get('numero_do_processo', 'unknown')}")
        return None
    
    logger.debug(f"Transforming record: {record.get('numero_do_processo', 'unknown')}")

    related_people, represented_lawyers = extract_parts(record)
    activities = extract_activities(record)

    try:
        lawsuit = Lawsuit(
            court=Court(rawValue=record.get("tribunal")),
            nature=record.get("classe"),
            kind=record.get("area"),
            subject=record.get("assunto"),
            distributionDate=to_timestamp(record.get("data_de_distribuicao")),
            judgeName=normalize_person_name(record.get("juiz"),is_lawyer=True),
            value=to_float(record.get("valor_da_acao")),
            justiceSecret=record.get("segredo_justica"),
            courtInstance=to_int(record.get("instancia")),
            number=record.get("numero_do_processo"),
            relatedPeople=related_people,
            representedPersonLawyers=represented_lawyers,
            activities=activities,
        )
    except Exception as e:
        logger.error(f"Validation failed for record numero_do_processo={record.get('numero_do_processo')}: {e}")
        return None

    logger.info(f"Successfully transformed record: {lawsuit.number}")
    return lawsuit.model_dump()
