"""
AtlasReg Cursor - Celery Adapter
Envia tasks para Celery workers
"""

from celery import Celery
from typing import Any, Dict, Optional
import time
from utils.logger import get_logger

logger = get_logger(__name__)


class CeleryAdapter:
    """Adapter para Celery"""
    
    def __init__(
        self,
        broker_url: str,
        result_backend: str
    ):
        """
        Inicializa adapter.
        
        Args:
            broker_url: URL do broker (Redis)
            result_backend: URL do result backend
        """
        self.app = Celery(
            'atlasreg_cursor',
            broker=broker_url,
            backend=result_backend
        )
        
        self.app.conf.update(
            task_serializer='json',
            accept_content=['json'],
            result_serializer='json',
            timezone='America/Sao_Paulo',
            enable_utc=True,
        )
    
    def send_task(
        self,
        task_name: str,
        args: Optional[list] = None,
        kwargs: Optional[Dict[str, Any]] = None,
        queue: str = 'default'
    ) -> Any:
        """
        Envia task para Celery.
        
        Args:
            task_name: Nome da task (ex: 'process_document')
            args: Argumentos posicionais
            kwargs: Argumentos nomeados
            queue: Nome da fila
        
        Returns:
            AsyncResult
        """
        logger.info(
            "sending_celery_task",
            task=task_name,
            args=args,
            queue=queue
        )
        
        result = self.app.send_task(
            task_name,
            args=args or [],
            kwargs=kwargs or {},
            queue=queue
        )
        
        logger.info(
            "celery_task_sent",
            task=task_name,
            task_id=result.id
        )
        
        return result
    
    def wait_for_task(
        self,
        async_result: Any,
        timeout: int = 300,
        poll_interval: float = 1.0
    ) -> Any:
        """
        Aguarda conclusao de task.
        
        Args:
            async_result: AsyncResult da task
            timeout: Timeout maximo (segundos)
            poll_interval: Intervalo de polling (segundos)
        
        Returns:
            Resultado da task
        
        Raises:
            TimeoutError: Se exceder timeout
            Exception: Se task falhar
        """
        logger.info(
            "waiting_for_task",
            task_id=async_result.id,
            timeout=timeout
        )
        
        try:
            result = async_result.get(timeout=timeout, interval=poll_interval)
            
            logger.info(
                "task_completed_success",
                task_id=async_result.id
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "task_failed",
                task_id=async_result.id,
                error=str(e)
            )
            raise
    
    def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """
        Verifica status de task.
        
        Args:
            task_id: ID da task
        
        Returns:
            Status info
        """
        result = self.app.AsyncResult(task_id)
        
        return {
            'task_id': task_id,
            'state': result.state,
            'info': result.info,
            'ready': result.ready(),
            'successful': result.successful() if result.ready() else None,
            'failed': result.failed() if result.ready() else None
        }

