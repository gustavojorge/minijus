from app.exceptions.custom_exceptions import CourtNotFoundException

def detect_tribunal_from_cnj(cnj: str) -> str:
    if ".8.02." in cnj:
        return "TJAL"
    elif ".8.06." in cnj:
        return "TJCE"
    else:
        raise CourtNotFoundException(cnj=cnj)