"""
AtlasReg Cursor - Structured Logging
"""

import structlog
import logging
import sys
from typing import Any, Dict


def setup_logging(log_level: str = "INFO") -> structlog.BoundLogger:
    """
    Configura logging estruturado para o Cursor.
    
    Args:
        log_level: Nivel de log (DEBUG, INFO, WARNING, ERROR)
    
    Returns:
        Logger configurado
    """
    
    # Configurar logging padrao Python
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )
    
    # Configurar structlog
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer() if sys.stdout.isatty() 
                else structlog.processors.JSONRenderer()
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, log_level.upper())
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=False,
    )
    
    return structlog.get_logger()


def get_logger(name: str = "cursor") -> structlog.BoundLogger:
    """
    Retorna logger para modulo especifico.
    
    Args:
        name: Nome do modulo
    
    Returns:
        Logger bound com contexto
    """
    return structlog.get_logger(name)


class LogContext:
    """Context manager para adicionar contexto ao log"""
    
    def __init__(self, **kwargs: Any):
        self.context = kwargs
    
    def __enter__(self):
        structlog.contextvars.bind_contextvars(**self.context)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        structlog.contextvars.unbind_contextvars(*self.context.keys())

