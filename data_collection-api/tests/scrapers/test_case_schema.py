import pytest
from datetime import date
from app.models.case_schema import Party, Movement, Case

def test_party_with_alias():
    party = Party(nome="João", papel="Autor", **{"advogado(as)": ["Dr. Silva"]})
    assert party.advogado_as == ["Dr. Silva"]
    assert party.model_dump(by_alias=True)["advogado(as)"] == ["Dr. Silva"]

def test_movement_creation():
    mov = Movement(data=date(2024, 5, 20), movimento="Distribuído")
    assert mov.data == date(2024, 5, 20)
    assert mov.movimento == "Distribuído"

def test_case_minimal():
    case = Case(tribunal="TJCE", instancia=1, numero_do_processo="0000000-00.0000.0.00.0000")
    assert case.existe is True
    assert case.segredo_justica is False
    assert case.partes_do_processo == []
    assert case.lista_das_movimentacoes == []

def test_case_full():
    party = Party(nome="Maria", papel="Ré", advogado_as=["Dr. Souza"])
    mov = Movement(data=date(2024, 5, 20), movimento="Sentença")
    case = Case(
        tribunal="TJAL",
        instancia=2,
        numero_do_processo="1234567-89.2024.8.01.0001",
        classe="Civil",
        area="Família",
        assunto="Divórcio",
        data_de_distribuicao=date(2024, 5, 20),
        juiz="Dr. Fulano",
        valor_da_acao=50000.0,
        segredo_justica=True,
        existe=True,
        partes_do_processo=[party],
        lista_das_movimentacoes=[mov]
    )
    assert case.segredo_justica is True
    assert case.classe == "Civil"
    assert len(case.partes_do_processo) == 1
    assert case.partes_do_processo[0].nome == "Maria"
