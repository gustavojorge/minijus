import re

CNJ_PATTERN = re.compile(
    r"^\d{2,7}[\-_]?\d{2}[\._]?\d{4}[\._]?\d{1}[\._]?\d{2}[\._]?\d{4}$"
)

PHRASE_PATTERN = re.compile(r'^(["\'])(?P<content>.+)\1$')

SEARCH_FIELDS = [
    "subject",
    "judge",
    "related_people.name",
    "lawyers.name",
    "nature",
    "kind"
]

HIGHLIGHT_FIELDS = [
    "number", "court", "judge", "kind", "nature",
    "subject", "related_people.name", "lawyers.name", "activities.description"
]
