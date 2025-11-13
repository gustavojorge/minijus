from transformers.parts_transformer import extract_parts

def test_extract_parts_with_lawyers():
    record = {
        "partes_do_processo": [
            {
                "nome": "joao da silva",
                "papel": "Autor",
                "advogado(as)": ["Dr. Fulano", "Dra. Beltrana"],
            },
            {"nome": "Empresa X", "papel": "Ré"},
        ]
    }
    people, lawyers = extract_parts(record)
    assert len(people) == 2
    assert any(p["author"] for p in people)
    assert len(lawyers) == 2
    assert all("representedPersonId" in l for l in lawyers)

def test_extract_parts_empty():
    people, lawyers = extract_parts({})
    assert people == []
    assert lawyers == []
