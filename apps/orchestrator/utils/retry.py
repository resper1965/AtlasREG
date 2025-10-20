"""
AtlasReg Cursor - Retry Utilities
Exponential backoff e retry logic
"""

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log
)
import logging
from typing import Callable, Type
import requests

logger = logging.getLogger(__name__)


def retry_with_backoff(
    max_attempts: int = 3,
    min_wait: int = 2,
    max_wait: int = 60,
    exceptions: tuple = (Exception,)
) -> Callable:
    """
    Decorator para retry com exponential backoff.
    
    Args:
        max_attempts: Numero maximo de tentativas
        min_wait: Tempo minimo de espera (segundos)
        max_wait: Tempo maximo de espera (segundos)
        exceptions: Tuple de excecoes para retry
    
    Returns:
        Decorator configurado
    """
    return retry(
        stop=stop_after_attempt(max_attempts),
        wait=wait_exponential(multiplier=1, min=min_wait, max=max_wait),
        retry=retry_if_exception_type(exceptions),
        before_sleep=before_sleep_log(logger, logging.WARNING),
        reraise=True
    )


def retry_network_call(max_attempts: int = 3) -> Callable:
    """
    Decorator especializado para chamadas de rede.
    Retries em erros HTTP 5xx e timeouts.
    
    Args:
        max_attempts: Numero maximo de tentativas
    
    Returns:
        Decorator configurado
    """
    return retry_with_backoff(
        max_attempts=max_attempts,
        exceptions=(
            requests.exceptions.Timeout,
            requests.exceptions.ConnectionError,
            requests.exceptions.HTTPError
        )
    )

