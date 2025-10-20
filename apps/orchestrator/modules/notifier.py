"""
AtlasReg Cursor - Notifier
Envia notificacoes para Cloudflare Worker via webhook
"""

import requests
from typing import Dict, Any, Optional
from datetime import datetime
from modules.hmac_signer import HMACSigner
from utils.retry import retry_network_call
from utils.logger import get_logger

logger = get_logger(__name__)


class Notifier:
    """Notifica Cloudflare Worker sobre eventos"""
    
    def __init__(
        self,
        hook_endpoint: str,
        hmac_secret: str,
        timeout: int = 30
    ):
        """
        Inicializa notifier.
        
        Args:
            hook_endpoint: URL do webhook
            hmac_secret: Secret para HMAC
            timeout: Timeout de request (segundos)
        """
        self.hook_endpoint = hook_endpoint
        self.signer = HMACSigner(hmac_secret)
        self.timeout = timeout
    
    @retry_network_call(max_attempts=3)
    def notify_ingest_complete(
        self,
        run_id: str,
        status: str,
        file_path: str,
        sha256: str,
        documents_count: int,
        errors_count: int = 0,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Notifica que ingestao foi completada.
        
        Args:
            run_id: ID da execucao
            status: Status (success, partial, failed)
            file_path: Path do JSON Gold no R2
            sha256: Hash SHA256 do arquivo
            documents_count: Numero de documentos processados
            errors_count: Numero de erros
            metadata: Metadata adicional
        
        Returns:
            Response do webhook
        """
        payload = {
            'event_type': 'ingest_complete',
            'run_id': run_id,
            'status': status,
            'completed_at': datetime.utcnow().isoformat(),
            'result': {
                'file_path': file_path,
                'sha256': sha256,
                'documents_count': documents_count,
                'errors_count': errors_count
            },
            'metadata': metadata or {}
        }
        
        logger.info(
            "sending_notification",
            run_id=run_id,
            status=status,
            endpoint=self.hook_endpoint
        )
        
        # Assinar payload
        headers = self.signer.sign_with_header(payload)
        
        # Enviar webhook
        response = requests.post(
            f"{self.hook_endpoint}/api/v1/hooks/ingest-complete",
            json=payload,
            headers=headers,
            timeout=self.timeout
        )
        
        response.raise_for_status()
        
        result = response.json()
        
        logger.info(
            "notification_sent_success",
            run_id=run_id,
            status_code=response.status_code
        )
        
        return result
    
    @retry_network_call(max_attempts=3)
    def notify_error(
        self,
        run_id: str,
        error_type: str,
        error_message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Notifica erro durante processamento.
        
        Args:
            run_id: ID da execucao
            error_type: Tipo de erro
            error_message: Mensagem de erro
            context: Contexto adicional
        
        Returns:
            Response do webhook
        """
        payload = {
            'event_type': 'processing_error',
            'run_id': run_id,
            'occurred_at': datetime.utcnow().isoformat(),
            'error': {
                'type': error_type,
                'message': error_message,
                'context': context or {}
            }
        }
        
        logger.error(
            "sending_error_notification",
            run_id=run_id,
            error_type=error_type
        )
        
        headers = self.signer.sign_with_header(payload)
        
        response = requests.post(
            f"{self.hook_endpoint}/api/v1/hooks/processing-error",
            json=payload,
            headers=headers,
            timeout=self.timeout
        )
        
        response.raise_for_status()
        return response.json()

