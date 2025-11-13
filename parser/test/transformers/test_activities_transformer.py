from transformers.activities_transformer import extract_activities


def test_extract_activities_happy_path():
    record = {
        "lista_das_movimentacoes": [
            {"data": "2024-01-01", "movimento": "Distribuído"},
            {"data": "2024-01-02", "movimento": "Concluso"},
        ]
    }
    acts = extract_activities(record)
    assert len(acts) == 2
    assert acts[0]["text"] == "Distribuído"
    assert isinstance(acts[0]["date"], int)


def test_extract_activities_empty():
    assert extract_activities({}) == []
