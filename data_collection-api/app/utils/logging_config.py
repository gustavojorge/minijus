import logging
import sys
from typing import Optional
from pathlib import Path

def setup_logging(
    level: str = "INFO",
    log_file: str = "logs/app.log"
) -> None:
    """
    Configura o sistema de logging da aplicação.
    
    Args:
        level: Nível de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Caminho para o arquivo de log
    """

    # Configurar nível
    log_level = getattr(logging, level.upper(), logging.INFO)
    
    # Configurar formatter simples
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(name)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Configurar logger raiz
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    
    # Remover handlers existentes
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Configurar handler para arquivo
    if log_file:
        # Criar diretório se não existir
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setFormatter(formatter)
        file_handler.setLevel(log_level)
        root_logger.addHandler(file_handler)
    
    # Configurar loggers de bibliotecas externas para reduzir ruído
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("playwright").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

def get_logger(name: str) -> logging.Logger:
    """
    Retorna um logger configurado para o módulo especificado.
    
    Args:
        name: Nome do módulo/logger
        
    Returns:
        Logger configurado
    """
    return logging.getLogger(name)