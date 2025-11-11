from indexer.services.normalization import normalize_document, strip_accents, normalize_court

def test_strip_accents():
    assert strip_accents("ação") == "acao"

def test_normalize_court():
    assert normalize_court("tjba ") == "TJBA"

def test_normalize_document_fields():
    doc = {"court": "tjba", "judge": " João ", "nature": " civil "}
    normalized = normalize_document(doc)
    assert normalized["court"] == "TJBA"
    assert normalized["judge"] == "João"
