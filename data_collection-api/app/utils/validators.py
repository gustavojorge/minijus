import re
from app.exceptions.custom_exceptions import InvalidCNJException

# CNJ pattern regex
CNJ_REGEX = re.compile(r"^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$")

def validate_cnj(cnj: str) -> str:
    """
    Validate if CNJ already matches the official masked format.
    Throws an InvalidCNJException if invalid.
    """
    if not CNJ_REGEX.match(cnj):
        raise InvalidCNJException(cnj)
    return cnj

def normalize_and_validate_cnj(raw_cnj: str) -> str:
    """Accepts a CNJ either already masked (NNNNNNN-DD.AAAA.J.TR.OOOO)
    or as a plain digit sequence (20 digits). If unmasked, applies the mask
    and then validates.
    """
    digits = re.sub(r"\D", "", raw_cnj)

    # If already in masked form and valid, early return
    if CNJ_REGEX.match(raw_cnj):
        return validate_cnj(raw_cnj)

    # Expect 20 digits for an unmasked CNJ
    if len(digits) != 20:
        raise InvalidCNJException(raw_cnj)

    # Apply mask
    masked = (
        f"{digits[0:7]}-{digits[7:9]}.{digits[9:13]}.{digits[13]}."
        f"{digits[14:16]}.{digits[16:20]}"
    )
    return validate_cnj(masked)
