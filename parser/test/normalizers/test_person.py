import pytest

from normalizers.person import normalize_person_name

@pytest.mark.parametrize(
    "raw,expected",
    [
        (None, ""),
        ("", ""),
        ("joao da silva", "Joao da Silva"),
        ("maria-do-carmo", "Maria-do-Carmo"),
        ("ANA D'ARC", "Ana D'Arc"),
        ("  José   dos   Santos  ", "José dos Santos"),
    ],
)
def test_normalize_person_name_basic(raw, expected):
    assert normalize_person_name(raw) == expected

@pytest.mark.parametrize(
    "raw,expected",
    [
        ("Dr. João Carlos", "João Carlos"),
        ("dra maria", "Maria"),
        ("DR JOSE", "Jose"),
        ("Dra. Ana Paula", "Ana Paula"),
    ],
)
def test_normalize_person_name_lawyer_prefix(raw, expected):
    assert normalize_person_name(raw, is_lawyer=True) == expected
