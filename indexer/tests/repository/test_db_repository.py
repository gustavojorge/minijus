from unittest.mock import MagicMock
from indexer.repository.db_repository import fetch_lawsuits

def test_fetch_lawsuits_executes_query():
    mock_conn = MagicMock()
    cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = cursor
    cursor.fetchall.return_value = [{"id": 1}]
    result = fetch_lawsuits(mock_conn)
    cursor.execute.assert_called_once()
    assert isinstance(result, list)
