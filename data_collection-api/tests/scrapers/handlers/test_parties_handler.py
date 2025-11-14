import pytest
from bs4 import BeautifulSoup
from app.scrapers.handlers.esaj.esaj_parties_handler import ESAJPartiesHandler
from app.models.case_schema import Party


# Simulates the TJAL layout with a standard lawyer
HTML_TJAL_LAYOUT = """
<table id="tableTodasPartes">
  <tr>
    <td><span class="tipoDeParticipacao">Apelante:</span></td>
    <td class="nomeParteEAdvogado">
      John Doe
      <br>
      <span>Advogado:</span> Dr. Smith
    </td>
  </tr>
</table>
"""

# Simulates the TJCE layout with a Public Defender and a second party
HTML_TJCE_WITH_DEFENSOR = """
<table id="tablePartesPrincipais">
  <tr>
    <td><span class="tipoDeParticipacao">Réu</span></td>
    <td class="nomeParteEAdvogado">
      Jane Roe
      <br>
      <span>Def. Público:</span> Dr. Publico
    </td>
  </tr>
  <tr>
    <td><span class="tipoDeParticipacao">Autor</span></td>
    <td class="nomeParteEAdvogado">
      Another Person
      <br>
      <span>Advogada:</span> Dra. Jones
    </td>
  </tr>
</table>
"""

# Simulates a party with a Prosecutor and another party with no lawyer
HTML_WITH_PROCURADOR_AND_NO_LAWYER = """
<table id="tableTodasPartes">
  <tr>
    <td><span class="tipoDeParticipacao">Interessado</span></td>
    <td class="nomeParteEAdvogado">
        The State
        <br>
        <span>Procurador:</span> Dr. Gov
    </td>
  </tr>
  <tr>
    <td><span class="tipoDeParticipacao">Testemunha</span></td>
    <td class="nomeParteEAdvogado">
        Just a Witness
    </td>
  </tr>
</table>
"""

# Simulates an empty HTML response
HTML_EMPTY = ""


@pytest.mark.parametrize(
    "html_input, expected_parties",
    [
        (
            # Test 1: Standard TJAL layout with one lawyer
            HTML_TJAL_LAYOUT,
            [
                Party(nome="John Doe", papel="Apelante", advogado_as=["Dr. Smith"]),
            ],
        ),
        (
            # Test 2: TJCE layout with a Public Defender and another party
            HTML_TJCE_WITH_DEFENSOR,
            [
                Party(nome="Jane Roe", papel="Réu", advogado_as=["Dr. Publico"]),
                Party(nome="Another Person", papel="Autor", advogado_as=["Dra. Jones"]),
            ],
        ),
        (
            # Test 3: Layout with a Prosecutor and a party with no lawyer
            HTML_WITH_PROCURADOR_AND_NO_LAWYER,
            [
                Party(nome="The State", papel="Interessado", advogado_as=["Dr. Gov"]),
                Party(nome="Just a Witness", papel="Testemunha", advogado_as=None),
            ],
        ),
        (
            # Test 4: Empty HTML should result in an empty list
            HTML_EMPTY,
            [],
        ),
    ],
)
def test_esaj_parties_handler(html_input, expected_parties):
    """
    Tests the ESAJPartiesHandler with various HTML layouts to ensure
    it correctly parses all types of legal representatives (Lawyers,
    Public Defenders, Prosecutors) and handles parties with no representation.
    """
    handler = ESAJPartiesHandler()
    soup = BeautifulSoup(html_input, "html.parser")

    result = handler.parse(soup)

    assert "partes_do_processo" in result
    assert result["partes_do_processo"] == expected_parties
