from typing import Any, List

def get_dict_path(dictionary: dict, path: List[str], default: Any) -> Any:
    current = dictionary
    for key in path:
        if not isinstance(current, dict):
            return default
        current = current.get(key, default)
    return current

