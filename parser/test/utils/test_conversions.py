import pytest
from datetime import datetime

from utils.conversions import to_timestamp, to_float, to_int

@pytest.mark.parametrize(
    "input_str,expected",
    [
        ("2024-01-01", int(datetime(2024, 1, 1).timestamp())),
        (None, None),
        ("", None),
        ("invalid", None),
    ],
)
def test_to_timestamp_parametrized(input_str, expected):
    assert to_timestamp(input_str) == expected

@pytest.mark.parametrize(
    "value,expected",
    [
        ("12.3", 12.3),
        (12, 12.0),
        (12.5, 12.5),
        (" ", None),
        (None, None),
        (True, None),
        ("abc", None),
    ],
)
def test_to_float_parametrized(value, expected):
    assert to_float(value) == expected

@pytest.mark.parametrize(
    "value,expected",
    [
        ("123", 123),
        (123, 123),
        (None, None),
        ("", None),
        (True, None),
        ("12.3", None),
    ],
)
def test_to_int_parametrized(value, expected):
    assert to_int(value) == expected
