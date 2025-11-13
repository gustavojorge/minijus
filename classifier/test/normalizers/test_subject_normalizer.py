import pytest

from normalizers.subject_normalizer import normalize_subject

@pytest.mark.parametrize(
    "raw,expected",
    [
        ("Violência Doméstica", "violencia domestica"),
        ("FEMINICÍDIO", "feminicidio"),
        (" Menor  infrator ", "menor infrator"),
        ("", ""),
        (None, ""),
        ("xenofobia!!!", "xenofobia"),
        ("a  --  b", "a b"),
    ],
)
def test_normalize_subject_parametrized(raw, expected):
    assert normalize_subject(raw) == expected
