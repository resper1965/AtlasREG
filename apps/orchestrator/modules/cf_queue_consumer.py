"""
AtlasReg Cursor - Cloudflare Queue Consumer
Consome mensagens da Cloudflare Queue (ou Redis List fallback)
"""

import requests
import redis
import json
import time
from typing import Dict, Any, Optional, Callable
from datetime import datetime
from utils.retry import retry_network_call
from utils.logger import get_logger

logger = get_logger(__name__)


class CFQueueConsumer:
    """Consumer para Cloudflare Queue (com fallback Redis)"""
    
    def __init__(
        self,
        mode: str = "standalone",
        cf_queue_endpoint: Optional[str] = None,
        cf_api_token: Optional[str] = None,
        redis_url: Optional[str] = None,
        queue_name: str = "ingest-queue"
    ):
        """
        Inicializa consumer.
        
        Args:
            mode: 'cloudflare' ou 'standalone' (Redis)
            cf_queue_endpoint: Endpoint da Queue Cloudflare
            cf_api_token: API token
            redis_url: Redis URL para modo standalone
            queue_name: Nome da fila
        """
        self.mode = mode
        self.cf_queue_endpoint = cf_queue_endpoint
        self.cf_api_token = cf_api_token
        self.queue_name = queue_name
        
        # Inicializar backend apropriado
        if mode == "standalone":
            if not redis_url:
                raise ValueError("redis_url required for standalone mode")
            self.redis = redis.from_url(redis_url, decode_responses=True)
            self.redis_queue_key = f"cursor:queue:{queue_name}"
            logger.info("queue_consumer_mode_standalone", redis_url=redis_url)
        else:
            if not cf_queue_endpoint or not cf_api_token:
                raise ValueError("CF credentials required for cloudflare mode")
            logger.info("queue_consumer_mode_cloudflare", endpoint=cf_queue_endpoint)
    
    def poll(self, timeout: int = 30) -> Optional[Dict[str, Any]]:
        """
        Poll por mensagem na fila.
        
        Args:
            timeout: Timeout (segundos)
        
        Returns:
            Mensagem ou None se fila vazia
        """
        if self.mode == "standalone":
            return self._poll_redis(timeout)
        else:
            return self._poll_cloudflare(timeout)
    
    def _poll_redis(self, timeout: int) -> Optional[Dict[str, Any]]:
        """Poll Redis List (BLPOP)"""
        
        try:
            result = self.redis.blpop(self.redis_queue_key, timeout=timeout)
            
            if result is None:
                return None
            
            _, message_json = result
            message = json.loads(message_json)
            
            logger.debug("message_received_redis", message_type=message.get('type'))
            return message
            
        except Exception as e:
            logger.error("redis_poll_error", error=str(e))
            return None
    
    @retry_network_call(max_attempts=3)
    def _poll_cloudflare(self, timeout: int) -> Optional[Dict[str, Any]]:
        """Poll Cloudflare Queue via API"""
        
        url = f"{self.cf_queue_endpoint}/queues/{self.queue_name}/messages"
        
        headers = {
            'Authorization': f'Bearer {self.cf_api_token}',
            'Content-Type': 'application/json'
        }
        
        # Cloudflare Queue API: pull messages
        response = requests.post(
            url,
            json={'batch_size': 1, 'visibility_timeout': timeout},
            headers=headers,
            timeout=timeout + 5
        )
        
        response.raise_for_status()
        data = response.json()
        
        messages = data.get('messages', [])
        
        if not messages:
            return None
        
        message = messages[0]
        
        # Ack message (marca como processada)
        self._ack_message(message['id'])
        
        logger.debug(
            "message_received_cloudflare",
            message_id=message['id'],
            message_type=message.get('body', {}).get('type')
        )
        
        return message.get('body', {})
    
    def _ack_message(self, message_id: str) -> None:
        """Acknowledge mensagem no Cloudflare"""
        
        url = f"{self.cf_queue_endpoint}/queues/{self.queue_name}/messages/{message_id}/ack"
        
        headers = {
            'Authorization': f'Bearer {self.cf_api_token}'
        }
        
        requests.post(url, headers=headers, timeout=10)
        logger.debug("message_acked", message_id=message_id)
    
    def push_mock_message(self, message: Dict[str, Any]) -> None:
        """
        Push mensagem mock na fila (apenas modo standalone).
        Util para testes.
        
        Args:
            message: Mensagem a enviar
        """
        if self.mode != "standalone":
            raise ValueError("push_mock_message only available in standalone mode")
        
        message_json = json.dumps(message)
        self.redis.rpush(self.redis_queue_key, message_json)
        
        logger.info("mock_message_pushed", message_type=message.get('type'))
    
    def start_consuming(
        self,
        message_handler: Callable[[Dict[str, Any]], None],
        poll_interval: int = 30
    ) -> None:
        """
        Inicia loop de consumo continuo.
        
        Args:
            message_handler: Funcao que processa mensagens
            poll_interval: Intervalo de polling (segundos)
        """
        logger.info(
            "starting_queue_consumer",
            mode=self.mode,
            poll_interval=poll_interval
        )
        
        while True:
            try:
                # Poll por mensagem
                message = self.poll(timeout=poll_interval)
                
                if message:
                    # Processar mensagem
                    try:
                        message_handler(message)
                    except Exception as e:
                        logger.error(
                            "message_handler_error",
                            error=str(e),
                            message=message
                        )
                
            except KeyboardInterrupt:
                logger.info("queue_consumer_stopped")
                break
            
            except Exception as e:
                logger.error("queue_consumer_error", error=str(e))
                time.sleep(poll_interval)

