import pytest
from unittest.mock import MagicMock
from datetime import datetime, date
from bson import ObjectId
from app.models.case_schema import Case, Party, Movement
from app.repositories.case_repository import get_cached_cases, save_case

@pytest.fixture
def mock_db(mocker):
    """Cria um mock do objeto de banco de dados e de suas coleções."""
    db_mock = MagicMock()
    db_mock.cases = MagicMock()
    db_mock.parties = MagicMock()
    db_mock.movements = MagicMock()

    mocker.patch("app.repositories.case_repository.get_db", return_value=db_mock)
    return db_mock


def test_get_cached_cases_hit(mock_db):
    """
    Testa o cenário de "cache hit", onde um processo recente é encontrado no banco.
    """
    # 1. Arrange (Preparação)
    cnj = "12345-67.2023.8.02.0001"
    case_id = ObjectId()
    
    # Simula os documentos que seriam retornados pelo MongoDB
    mock_db.cases.find.return_value = [{
        "_id": case_id, "tribunal": "TJAL", "instancia": 1, "numero_do_processo": cnj,
        "classe": "Ação de Teste", "data_de_distribuicao": datetime(2023, 1, 1)
    }]
    mock_db.parties.find.return_value = [{"nome": "John Doe", "papel": "Autor", "advogados": ["Dr. Smith"]}]
    mock_db.movements.find.return_value = [{"data": datetime(2023, 1, 2), "movimento": "Petição inicial"}]

    # 2. Act (Ação)
    results = get_cached_cases(cnj, 3600)

    # 3. Assert (Verificação)
    assert len(results) == 1
    case = results[0]
    assert isinstance(case, Case)
    assert case.classe == "Ação de Teste"
    assert len(case.partes_do_processo) == 1
    assert case.partes_do_processo[0].nome == "John Doe"
    assert len(case.lista_das_movimentacoes) == 1
    assert case.lista_das_movimentacoes[0].data == date(2023, 1, 2)
    mock_db.cases.find.assert_called_once() # Garante que a busca foi feita

def test_get_cached_cases_miss(mock_db):
    """
    Testa o cenário de "cache miss", onde nenhum processo recente é encontrado.
    """
    cnj = "12345-67.2023.8.02.0001"
    # Simula o MongoDB não encontrando nenhum documento
    mock_db.cases.find.return_value = []

    results = get_cached_cases(cnj, 3600)

    assert len(results) == 0
    mock_db.cases.find.assert_called_once()


# --- Testes para save_case ---

def test_save_case_insert_new(mock_db):
    """
    Testa o cenário de inserção de um novo processo que ainda não existe no banco.
    """
    new_case = Case(
        tribunal="TJAL", instancia=1, numero_do_processo="111-11", existe=True,
        partes_do_processo=[Party(nome="Parte A", papel="Autor")],
        lista_das_movimentacoes=[Movement(data=date(2023, 1, 1), movimento="Início")]
    )
    # Simula que o processo não existe
    mock_db.cases.find_one.return_value = None
    # Simula o ID que seria retornado pelo insert
    mock_db.cases.insert_one.return_value.inserted_id = ObjectId()

    save_case(new_case)

    mock_db.cases.find_one.assert_called_once()
    mock_db.cases.insert_one.assert_called_once() # Garante que a inserção ocorreu
    mock_db.parties.insert_many.assert_called_once()
    mock_db.movements.insert_many.assert_called_once()
    mock_db.cases.update_one.assert_not_called() # Garante que o update NÃO ocorreu

def test_save_case_update_existing(mock_db):
    """
    Testa o cenário de atualização de um processo que já existe no banco.
    """
    updated_case = Case(
        tribunal="TJAL", instancia=1, numero_do_processo="222-22", existe=True,
        classe="Nova Classe"
    )
    case_id = ObjectId()
    # Simula que o processo JÁ existe
    mock_db.cases.find_one.return_value = {"_id": case_id}

    save_case(updated_case)

    mock_db.cases.find_one.assert_called_once()
    mock_db.cases.update_one.assert_called_once() # Garante que a ATUALIZAÇÃO ocorreu
    mock_db.parties.delete_many.assert_called_once() # Garante que os dados antigos foram limpos
    mock_db.movements.delete_many.assert_called_once()
    mock_db.cases.insert_one.assert_not_called() # Garante que a inserção NÃO ocorreu
