import pytest
from app.utils.validators import normalize_and_validate_cnj, validate_cnj
from app.exceptions.custom_exceptions import InvalidCNJException

@pytest.mark.parametrize(
    "raw, expected",
    [
        ("0710802-55.2018.8.02.0001", "0710802-55.2018.8.02.0001"),  # already masked
        ("07108025520188020001", "0710802-55.2018.8.02.0001"),       # unmasked
    ],
)
def test_normalize_and_validate_success(raw, expected):
    assert normalize_and_validate_cnj(raw) == expected

@pytest.mark.parametrize(
    "raw",
    [
        "0710802-55.2018.8.02.000",      # too short masked
        "0710802552018802000",           # too short digits
        "abc8025520188020001",           # letters mixed
        "",                              # empty
    ],
)
def test_normalize_and_validate_failure(raw):
    with pytest.raises(InvalidCNJException):
        normalize_and_validate_cnj(raw)


def test_validate_cnj_only_accepts_masked():
    validate_cnj("0710802-55.2018.8.02.0001")
    with pytest.raises(InvalidCNJException):
        validate_cnj("07108025520188020001")
