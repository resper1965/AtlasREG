"""
AtlasReg Cursor v2.0 - Main Entry Point
Orquestrador Cloudflare-Python

Powered by: ness.
"""

import sys
import signal
import time
from typing import Dict, Any
from datetime import datetime
import uuid

from config.settings import get_settings
from utils.logger import setup_logging, get_logger, LogContext
from modules.cf_config_client import CFConfigClient
from modules.cf_queue_consumer import CFQueueConsumer
from modules.r2_publisher import R2Publisher
from modules.notifier import Notifier
from modules.atlasreg_executor import AtlasRegExecutor
from adapters.airflow_adapter import AirflowAdapter
from adapters.celery_adapter import CeleryAdapter
from adapters.scraper_adapter import ScraperAdapter

# Configuracao global
settings = get_settings()
logger = setup_logging(settings.log_level)


class CursorOrchestrator:
    """Orquestrador principal do AtlasReg Cursor"""
    
    def __init__(self):
        """Inicializa orquestrador e componentes"""
        
        logger.info("initializing_cursor_orchestrator", version="2.0.0")
        
        # Inicializar clientes Cloudflare
        self.config_client = CFConfigClient(
            kv_api_endpoint=settings.cf_kv_api_endpoint,
            kv_namespace_id=settings.cf_kv_namespace_id,
            api_token=settings.cf_api_token
        )
        
        self.queue_consumer = CFQueueConsumer(
            mode=settings.mode,
            cf_queue_endpoint=settings.cf_queue_endpoint,
            cf_api_token=settings.cf_api_token,
            redis_url=settings.redis_url,
            queue_name=settings.cf_queue_name
        )
        
        # Publisher R2 (ou MinIO fallback)
        r2_endpoint = settings.r2_endpoint or f"http://{settings.minio_endpoint}"
        r2_access = settings.r2_access_key or settings.minio_access_key
        r2_secret = settings.r2_secret_key or settings.minio_secret_key
        
        self.r2_publisher = R2Publisher(
            endpoint_url=r2_endpoint,
            access_key=r2_access,
            secret_key=r2_secret,
            bucket_name=settings.r2_bucket_name
        )
        
        # Notifier
        hook_endpoint = settings.hook_endpoint or "http://api:8000"
        self.notifier = Notifier(
            hook_endpoint=hook_endpoint,
            hmac_secret=settings.hook_hmac_secret
        )
        
        # Adapters AtlasReg Core
        self.airflow = AirflowAdapter(
            api_url=settings.airflow_api_url,
            username=settings.airflow_username,
            password=settings.airflow_password
        )
        
        self.celery = CeleryAdapter(
            broker_url=settings.celery_broker_url,
            result_backend=settings.celery_result_backend
        )
        
        self.scraper = ScraperAdapter()
        
        # Executor principal
        self.executor = AtlasRegExecutor(
            airflow_adapter=self.airflow,
            celery_adapter=self.celery,
            scraper_adapter=self.scraper
        )
        
        logger.info("cursor_orchestrator_initialized")
    
    def process_message(self, message: Dict[str, Any]) -> None:
        """
        Processa mensagem da fila.
        
        Args:
            message: Mensagem recebida
        """
        msg_type = message.get('type')
        
        with LogContext(message_type=msg_type):
            logger.info("processing_message", message=message)
            
            if msg_type == 'start_daily_ingest':
                self._handle_daily_ingest(message)
            
            elif msg_type == 'reprocess':
                self._handle_reprocess(message)
            
            else:
                logger.warning("unknown_message_type", type=msg_type)
    
    def _handle_daily_ingest(self, message: Dict[str, Any]) -> None:
        """
        Handler para start_daily_ingest.
        
        Flow:
        1. Buscar catalogo de fontes
        2. Executar scrapers para cada fonte
        3. Aguardar processamento
        4. Gerar JSON Gold
        5. Publicar no R2
        6. Notificar webhook
        """
        run_id = f"run_{uuid.uuid4().hex[:12]}"
        date = message.get('date', datetime.utcnow().strftime('%Y-%m-%d'))
        
        with LogContext(run_id=run_id, date=date):
            logger.info("starting_daily_ingest")
            
            try:
                # 1. Buscar configuracao de fontes
                config = self.config_client.get_config()
                sources = [s for s in config.get('sources', []) if s.get('enabled')]
                
                logger.info("sources_loaded", sources_count=len(sources))
                
                # 2. Executar coleta para cada fonte
                batch_result = self.executor.execute_batch(sources, run_id)
                
                # 3. Aguardar processamento (tasks Celery ja disparadas)
                logger.info("waiting_for_processing_completion")
                time.sleep(5)  # Aguardar tasks iniciarem
                
                # 4. Trigger geracao de JSON Gold
                gold_task = self.executor.generate_gold_json(run_id, date)
                gold_result = self.celery.wait_for_task(gold_task, timeout=600)
                
                logger.info("gold_json_generated", result=gold_result)
                
                # 5. Publicar JSON Gold no R2
                gold_key = f"gold/{date}/{run_id}.json"
                publish_result = self.r2_publisher.publish(
                    data=gold_result,
                    key=gold_key,
                    metadata={'run_id': run_id, 'date': date}
                )
                
                # 6. Notificar webhook
                self.notifier.notify_ingest_complete(
                    run_id=run_id,
                    status='success',
                    file_path=gold_key,
                    sha256=publish_result['sha256'],
                    documents_count=batch_result['total_items'],
                    errors_count=batch_result['error_count']
                )
                
                logger.info("daily_ingest_complete", run_id=run_id)
                
            except Exception as e:
                logger.error("daily_ingest_failed", error=str(e), run_id=run_id)
                
                # Notificar erro
                try:
                    self.notifier.notify_error(
                        run_id=run_id,
                        error_type=type(e).__name__,
                        error_message=str(e)
                    )
                except:
                    pass
                
                raise
    
    def _handle_reprocess(self, message: Dict[str, Any]) -> None:
        """
        Handler para reprocess.
        
        Re-processa dados de uma data especifica.
        """
        run_id = f"reprocess_{uuid.uuid4().hex[:12]}"
        date = message.get('date')
        
        if not date:
            logger.error("reprocess_missing_date")
            return
        
        with LogContext(run_id=run_id, date=date):
            logger.info("starting_reprocess")
            
            try:
                # Trigger task de reprocessamento
                reprocess_task = self.celery.send_task(
                    'reprocess_date',
                    kwargs={'date': date, 'run_id': run_id}
                )
                
                # Aguardar conclusao
                result = self.celery.wait_for_task(reprocess_task, timeout=1800)
                
                # Gerar JSON Gold
                gold_task = self.executor.generate_gold_json(run_id, date)
                gold_result = self.celery.wait_for_task(gold_task, timeout=600)
                
                # Publicar
                gold_key = f"gold/{date}/{run_id}_reprocessed.json"
                publish_result = self.r2_publisher.publish(
                    data=gold_result,
                    key=gold_key,
                    metadata={'run_id': run_id, 'date': date, 'type': 'reprocess'}
                )
                
                # Notificar
                self.notifier.notify_ingest_complete(
                    run_id=run_id,
                    status='success',
                    file_path=gold_key,
                    sha256=publish_result['sha256'],
                    documents_count=result.get('documents_count', 0),
                    metadata={'type': 'reprocess'}
                )
                
                logger.info("reprocess_complete", run_id=run_id)
                
            except Exception as e:
                logger.error("reprocess_failed", error=str(e), run_id=run_id)
                raise
    
    def start(self) -> None:
        """Inicia loop principal do Cursor"""
        
        logger.info(
            "cursor_starting",
            mode=settings.mode,
            version="2.0.0"
        )
        
        # Setup signal handlers
        signal.signal(signal.SIGTERM, self._shutdown_handler)
        signal.signal(signal.SIGINT, self._shutdown_handler)
        
        # Iniciar consumo da fila
        self.queue_consumer.start_consuming(
            message_handler=self.process_message,
            poll_interval=settings.queue_poll_interval
        )
    
    def _shutdown_handler(self, signum, frame):
        """Handler para shutdown gracioso"""
        logger.info("shutdown_signal_received", signal=signum)
        sys.exit(0)


def main():
    """Entry point principal"""
    
    try:
        orchestrator = CursorOrchestrator()
        orchestrator.start()
    
    except Exception as e:
        logger.error("cursor_fatal_error", error=str(e))
        sys.exit(1)


if __name__ == '__main__':
    main()

