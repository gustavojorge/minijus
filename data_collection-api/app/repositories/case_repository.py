from datetime import datetime, timedelta, time
from typing import List
from bson.objectid import ObjectId
from pymongo import ReturnDocument
from app.db.mongo import get_db, get_client
from app.models.case_schema import Case, Party, Movement

def _date_to_datetime(d):
    if d is None:
        return None
    return datetime.combine(d, time.min)

def _datetime_to_date(dt):
    if dt is None:
        return None
    return dt.date()

def get_cached_cases(numero_do_processo: str, max_age_seconds: int) -> List[Case]:
    """
    Returns a list of Cases if the documents exist and are recent (updated_at >= now - max_age_seconds).
    Otherwise, it returns an empty list.
    """
    db = get_db()
    now = datetime.utcnow()
    cutoff = now - timedelta(seconds=max_age_seconds)

    docs = list(db.cases.find({"numero_do_processo": numero_do_processo, "updated_at": {"$gte": cutoff}}))
    results: List[Case] = []
    for doc in docs:
        case_id = doc["_id"]
        parties_docs = list(db.parties.find({"case_id": case_id}))
        movements_docs = list(db.movements.find({"case_id": case_id}))

        partes = [
            Party(
                nome=p.get("nome"),
                papel=p.get("papel"),
                advogado_as=p.get("advogados") or None
            )
            for p in parties_docs
        ]

        movs = [
            Movement(
                data=_datetime_to_date(m.get("data")),
                movimento=m.get("movimento")
            )
            for m in movements_docs
        ]

        case = Case(
            tribunal=doc.get("tribunal"),
            classe=doc.get("classe"),
            area=doc.get("area"),
            assunto=doc.get("assunto"),
            data_de_distribuicao=_datetime_to_date(doc.get("data_de_distribuicao")),
            juiz=doc.get("juiz"),
            valor_da_acao=doc.get("valor_da_acao"),
            segredo_justica=doc.get("segredo_justica", False),
            existe=doc.get("existe", True),
            partes_do_processo=partes,
            lista_das_movimentacoes=movs,
            instancia=doc.get("instancia"),
            numero_do_processo=doc.get("numero_do_processo")
        )
        results.append(case)
    return results

def save_case(case: Case) -> ObjectId:
    """
    Salves (insert/update) a Case and its relationships (partes, movimentacoes).
    """
    db = get_db()
    now = datetime.utcnow()
    
    case_doc = {
        "tribunal": case.tribunal,
        "classe": case.classe,
        "area": case.area,
        "assunto": case.assunto,
        "data_de_distribuicao": _date_to_datetime(case.data_de_distribuicao),
        "juiz": case.juiz,
        "valor_da_acao": case.valor_da_acao,
        "segredo_justica": case.segredo_justica,
        "existe": case.existe,
        "updated_at": now
    }

    q = {"numero_do_processo": case.numero_do_processo, "instancia": case.instancia}
    existing = db.cases.find_one(q)

    if existing:
        case_id = existing["_id"]
        db.cases.update_one({"_id": case_id}, {"$set": case_doc})
        db.parties.delete_many({"case_id": case_id})
        db.movements.delete_many({"case_id": case_id})
    else:
        insert_doc = {**case_doc, "numero_do_processo": case.numero_do_processo, "instancia": case.instancia}
        res = db.cases.insert_one(insert_doc)
        case_id = res.inserted_id

    # insert parties
    if case.partes_do_processo:
        db.parties.insert_many([
            {
                "case_id": case_id,
                "nome": p.nome,
                "papel": p.papel,
                "advogados": p.advogado_as or []
            }
            for p in case.partes_do_processo
        ])

    # inserir movements
    if case.lista_das_movimentacoes:
        db.movements.insert_many([
            {
                "case_id": case_id,
                "data": _date_to_datetime(m.data),
                "movimento": m.movimento
            }
            for m in case.lista_das_movimentacoes
        ])

    return case_id
