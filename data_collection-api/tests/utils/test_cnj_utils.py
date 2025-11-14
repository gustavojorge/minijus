import pytest
from app.utils.cnj_utils import detect_tribunal_from_cnj
from app.exceptions.custom_exceptions import CourtNotFoundException

# --- Testes de Sucesso ---

@pytest.mark.parametrize(
    "cnj, expected_court",
    [
        ("0710802-55.2018.8.02.0001", "TJAL"), # Caso TJAL
        ("0070337-91.2008.8.06.0001", "TJCE"), # Caso TJCE
        ("1234567-89.2023.8.02.9999", "TJAL"), # Outro caso TJAL
        ("9876543-21.2020.8.06.8888", "TJCE"), # Outro caso TJCE
    ]
)
def test_detect_tribunal_from_cnj_success(cnj, expected_court):
    """
    Verifica se a função identifica corretamente os tribunais suportados (TJAL e TJCE).
    """
    result = detect_tribunal_from_cnj(cnj)
    
    assert result == expected_court


def test_detect_tribunal_unsupported_court():
    """
    Verifica se a função lança CourtNotFoundException para um tribunal não suportado.
    """
    unsupported_cnj = "0000000-00.2023.8.26.0001"  # .8.26. é de São Paulo (TJSP)

    # O bloco 'with pytest.raises' verifica se a exceção esperada foi lançada.
    # Se a exceção for lançada, o teste passa. Se não for, ele falha.
    with pytest.raises(CourtNotFoundException) as exc_info:
        detect_tribunal_from_cnj(unsupported_cnj)
    
    # Verificação opcional para garantir que a exceção contém o CNJ correto
    assert exc_info.value.cnj == unsupported_cnj
