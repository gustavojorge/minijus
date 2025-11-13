import pytest
from unittest.mock import patch

from transformers.lawsuit_transformer import transform

def test_transform_discards_when_existe_false():
    record = {"existe": False, "numero_do_processo": "0001"}
    assert transform(record) is None

@patch("transformers.lawsuit_transformer.extract_parts", return_value=([], []))
@patch("transformers.lawsuit_transformer.extract_activities", return_value=[])
def test_transform_builds_expected_structure(mock_acts, mock_parts):
    record = {
        "existe": True,
        "tribunal": "TJX",
        "classe": "Ação",
        "area": "Cível",
        "assunto": "Contratos",
        "data_de_distribuicao": "2024-01-01",
        "juiz": "Dr. Juiz",
        "valor_da_acao": "1000.50",
        "segredo_justica": False,
        "instancia": "1",
        "numero_do_processo": "123",
    }
    out = transform(record)
    assert out is not None
    assert out["court"]["rawValue"] == "TJX"
    assert out["nature"] == "Ação"
    assert out["kind"] == "Cível"
    assert out["subject"] == "Contratos"
    assert isinstance(out["distributionDate"], int)
    assert out["judgeName"] == "Dr. Juiz"
    assert out["value"] == 1000.50
    assert out["courtInstance"] == 1
    assert out["number"] == "123"
    assert out["relatedPeople"] == []
    assert out["representedPersonLawyers"] == []
    assert out["activities"] == []
