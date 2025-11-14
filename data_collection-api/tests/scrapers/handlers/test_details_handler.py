import pytest
from datetime import date
from bs4 import BeautifulSoup
from app.scrapers.handlers.esaj.esaj_details_handler import ESAJDetailsHandler

# --- MOCK HTMLs PARA SIMULAR DIFERENTES CENÁRIOS ---

# Simula o layout da 1ª instância do TJAL
HTML_TJAL_1ST = """
<div>
    <span id="classeProcesso">Procedimento Comum Cível</span>
    <div id="areaProcesso">Cível</div>
    <span id="assuntoProcesso">Dano Material</span>
    <div id="dataHoraDistribuicaoProcesso">02/05/2018 às 19:01</div>
    <span id="juizProcesso">Henrique Teixeira</span>
    <div id="valorAcaoProcesso">R$ 281.178,42</div>
</div>
"""

# Simula o layout da 2ª instância do TJAL (com Relator e id de data diferente)
HTML_TJAL_2ND = """
<div>
    <div id="classeProcesso">Apelação Cível</div>
    <div id="areaProcesso">Cível</div>
    <span id="assuntoProcesso">Obrigações</span>
    <div id="dataDistribuicaoProcesso">10/03/2019</div>
    <div id="relatorProcesso">Desembargador Souza</div>
    <div id="valorAcaoProcesso">R$ 1.500,50</div>
</div>
"""

# Simula o layout do TJCE (com classe no 'title' e data via 'label')
HTML_TJCE = """
<div>
    <span id="classeProcesso" title="Execução de Título Extrajudicial"></span>
    <div id="areaProcesso">Cível</div>
    <span id="assuntoProcesso">Cheque</span>
    <div>
        <span class="unj-label">Distribuição</span>
        <div>21/03/2016 - Sorteio</div>
    </div>
</div>
"""

# Simula uma página onde alguns campos não existem
HTML_MISSING_FIELDS = """
<div>
    <span id="classeProcesso">Busca e Apreensão</span>
    <div id="areaProcesso">Cível</div>
</div>
"""

# --- INÍCIO DOS TESTES ---

# O decorador parametrize permite rodar a mesma função de teste com diferentes dados
@pytest.mark.parametrize(
    "html_input, expected_output",
    [
        (
            # Teste 1: Layout completo da 1ª instância do TJAL
            HTML_TJAL_1ST,
            {
                "classe": "Procedimento Comum Cível",
                "area": "Cível",
                "assunto": "Dano Material",
                "data_de_distribuicao": date(2018, 5, 2),
                "juiz": "Henrique Teixeira",
                "valor_da_acao": 281178.42,
            },
        ),
        (
            # Teste 2: Layout da 2ª instância do TJAL, com fallback para Relator e outro id de data
            HTML_TJAL_2ND,
            {
                "classe": "Apelação Cível",
                "area": "Cível",
                "assunto": "Obrigações",
                "data_de_distribuicao": date(2019, 3, 10),
                "juiz": "Desembargador Souza",
                "valor_da_acao": 1500.50,
            },
        ),
        (
            # Teste 3: Layout do TJCE, com extração de classe pelo 'title' e data pela 'label'
            HTML_TJCE,
            {
                "classe": "Execução de Título Extrajudicial",
                "area": "Cível",
                "assunto": "Cheque",
                "data_de_distribuicao": date(2016, 3, 21),
                "juiz": None,
                "valor_da_acao": None,
            },
        ),
        (
            # Teste 4: Layout com campos faltando, deve retornar None sem quebrar
            HTML_MISSING_FIELDS,
            {
                "classe": "Busca e Apreensão",
                "area": "Cível",
                "assunto": None,
                "data_de_distribuicao": None,
                "juiz": None,
                "valor_da_acao": None,
            },
        ),
        (
            # Teste 5: HTML vazio, deve retornar None para todos os campos
            "",
            {
                "classe": None,
                "area": None,
                "assunto": None,
                "data_de_distribuicao": None,
                "juiz": None,
                "valor_da_acao": None,
            },
        ),
    ],
)
def test_esaj_details_handler(html_input, expected_output):
    """
    Testa o ESAJDetailsHandler com diferentes variações de HTML para garantir
    que a extração de dados é robusta e universal.
    """
    # 1. Arrange (Preparação)
    handler = ESAJDetailsHandler()
    soup = BeautifulSoup(html_input, "html.parser")

    # 2. Act (Ação)
    result = handler.parse(soup)

    # 3. Assert (Verificação)
    assert result == expected_output
