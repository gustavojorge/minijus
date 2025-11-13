import re
from typing import List, Optional

def normalize_person_name(raw: Optional[str], *, is_lawyer: bool = False) -> str:

    if not raw:
        return ""

    name = raw.strip()

    if is_lawyer:
        name = re.sub(r'(?i)^\s*(dr|dra)\.?\s+', '', name)

    name = re.sub(r'\s+', ' ', name).strip()

    lower_exceptions = {"de", "do", "da", "dos", "das"}

    def capitalize_token(token: str) -> str:
        subparts = re.split(r"([-'])", token)
        out = []
        for sp in subparts:
            if sp in {"-", "'"}:
                out.append(sp)
            else:
                sp_clean = sp.strip()
                if not sp_clean:
                    continue
                if sp_clean.lower() in lower_exceptions:
                    out.append(sp_clean.lower())
                else:
                    out.append(sp_clean.capitalize())
        return "".join(out)

    parts = name.split()   
    normalized_parts: List[str] = []
    for part in parts:
        if part.lower() in lower_exceptions:
            normalized_parts.append(part.lower())
        else:
            normalized_parts.append(capitalize_token(part))

    return " ".join(normalized_parts)
