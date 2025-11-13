import pytest
from unittest.mock import patch

from classifiers.sensitive_subject_classifier import classify_sensitive_kind, sensitive_kind

@pytest.mark.parametrize(
    "subject,expected",
    [
        (None, None),
        ("", None),
        ("Menor infrator", "MENOR_INFRATOR"),
        ("Violência Doméstica contra a mulher", "VIOLENCIA_DOMESTICA"),
        ("Racismo", "CRIME_ODIO"),
        ("Assunto qualquer", None),
    ],
)
def test_classify_sensitive_kind_parametrized(subject, expected):
    assert classify_sensitive_kind(subject) == expected

def test_sensitive_kind_mutates_record_and_logs(monkeypatch):
    rec = {"number": "123", "subject": "Racismo"}
    with patch("classifiers.sensitive_subject_classifier.classify_sensitive_kind", return_value="CRIME_ODIO"):
        out = sensitive_kind(rec)
    assert out is rec 
    assert rec["sensitiveKind"] == "CRIME_ODIO"
