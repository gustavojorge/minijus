import pytest
from datetime import date
from bs4 import BeautifulSoup
from app.scrapers.handlers.esaj.esaj_movements_handler import ESAJMovementsHandler
from app.models.case_schema import Movement

# --- MOCK HTMLs FOR SIMULATING DIFFERENT SCENARIOS ---

# Simulates the TJAL layout with the primary table ID ('tabelaTodasMovimentacoes')
HTML_TJAL_LAYOUT = """
<tbody id="tabelaTodasMovimentacoes">
  <tr>
    <td class="dataMovimentacao"> 25/09/2025 </td>
    <td>Protocolo</td>
    <td class="descricaoMovimentacao">
      Remetido ao DJE
      <span>Relação: 0123/2025 Teor do ato: ...</span>
    </td>
  </tr>
  <tr>
    <td class="dataMovimentacao"> 24/09/2025 </td>
    <td>Protocolo</td>
    <td class="descricaoMovimentacao">Juntada de Petição</td>
  </tr>
</tbody>
"""

# Simulates the TJCE layout with the fallback table ID ('tabelaUltimasMovimentacoes')
HTML_TJCE_LAYOUT = """
<tbody id="tabelaUltimasMovimentacoes">
  <tr>
    <td class="dataMovimentacaoProcesso"> 10/01/2024 </td>
    <td>-</td>
    <td class="descricaoMovimentacaoProcesso">
        Recebidos os autos
        <i>Lote 123</i>
    </td>
  </tr>
</tbody>
"""

# Simulates a table with an invalid row (e.g., a header or malformed data)
HTML_WITH_INVALID_ROW = """
<tbody id="tabelaTodasMovimentacoes">
  <tr>
    <td> Data Inválida </td>
    <td>...</td>
    <td> Movimento com data inválida </td>
  </tr>
  <tr>
    <td> 15/02/2023 </td>
    <td>...</td>
    <td> Movimento Válido Após Erro </td>
  </tr>
</tbody>
"""

# Simulates an empty HTML response
HTML_EMPTY = ""

# --- START OF TESTS ---

@pytest.mark.parametrize(
    "html_input, expected_movements",
    [
        (
            # Test 1: Standard TJAL layout
            HTML_TJAL_LAYOUT,
            [
                Movement(data=date(2025, 9, 25), movimento="Remetido ao DJE Relação: 0123/2025 Teor do ato: ..."),
                Movement(data=date(2025, 9, 24), movimento="Juntada de Petição"),
            ],
        ),
        (
            # Test 2: TJCE layout using the fallback table ID
            HTML_TJCE_LAYOUT,
            [
                Movement(data=date(2024, 1, 10), movimento="Recebidos os autos Lote 123"),
            ],
        ),
        (
            # Test 3: Table with invalid rows should be skipped gracefully
            HTML_WITH_INVALID_ROW,
            [
                Movement(data=date(2023, 2, 15), movimento="Movimento Válido Após Erro"),
            ],
        ),
        (
            # Test 4: Empty HTML should result in an empty list
            HTML_EMPTY,
            [],
        ),
    ],
)
def test_esaj_movements_handler(html_input, expected_movements):
    """
    Tests the ESAJMovementsHandler with various HTML layouts to ensure
    it correctly parses movements, handles fallbacks, and skips invalid data.
    """
    # 1. Arrange
    handler = ESAJMovementsHandler()
    soup = BeautifulSoup(html_input, "html.parser")

    # 2. Act
    result = handler.parse(soup)

    # 3. Assert
    assert "lista_das_movimentacoes" in result
    assert result["lista_das_movimentacoes"] == expected_movements
