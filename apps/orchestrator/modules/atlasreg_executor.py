"""
AtlasReg Cursor - AtlasReg Executor
Facade para acionar scrapers e processamento no AtlasReg Core
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
from adapters.airflow_adapter import AirflowAdapter
from adapters.celery_adapter import CeleryAdapter
from adapters.scraper_adapter import ScraperAdapter
from utils.logger import get_logger

logger = get_logger(__name__)


class AtlasRegExecutor:
    """
    Executor principal que orquestra o pipeline AtlasReg Core.
    Implementa Adapter Pattern para diferentes handlers.
    """
    
    def __init__(
        self,
        airflow_adapter: AirflowAdapter,
        celery_adapter: CeleryAdapter,
        scraper_adapter: ScraperAdapter
    ):
        """
        Inicializa executor.
        
        Args:
            airflow_adapter: Adapter para Airflow
            celery_adapter: Adapter para Celery
            scraper_adapter: Adapter para Scrapers
        """
        self.airflow = airflow_adapter
        self.celery = celery_adapter
        self.scraper = scraper_adapter
        
        # Map de handler_id -> funcao de execucao
        self.handlers = {
            'SCRAPY_CVM_API': self._handle_scrapy_cvm,
            'SCRAPY_NEWSROOM_PLAYER': self._handle_scrapy_newsroom,
            'DOWNLOAD_CSV': self._handle_download_csv,
            'AIRFLOW_DAG': self._handle_airflow_dag,
            'CUSTOM_SCRAPER': self._handle_custom_scraper
        }
    
    def execute_source(
        self,
        source_config: Dict[str, Any],
        run_id: str
    ) -> Dict[str, Any]:
        """
        Executa coleta para uma fonte especifica.
        
        Args:
            source_config: Configuracao da fonte
            run_id: ID da execucao
        
        Returns:
            Resultado da coleta
        """
        handler_id = source_config.get('handler_id')
        source_id = source_config.get('id')
        source_name = source_config.get('name', 'Unknown')
        
        logger.info(
            "executing_source",
            source_id=source_id,
            source_name=source_name,
            handler_id=handler_id,
            run_id=run_id
        )
        
        # Verificar se handler existe
        if handler_id not in self.handlers:
            logger.error(
                "handler_not_found",
                handler_id=handler_id,
                source_id=source_id
            )
            return {
                'success': False,
                'error': f'Handler not found: {handler_id}'
            }
        
        # Executar handler
        try:
            handler_func = self.handlers[handler_id]
            result = handler_func(source_config, run_id)
            
            logger.info(
                "source_execution_complete",
                source_id=source_id,
                success=result.get('success', False),
                items_count=result.get('items_count', 0)
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "source_execution_failed",
                source_id=source_id,
                error=str(e)
            )
            return {
                'success': False,
                'error': str(e)
            }
    
    def execute_batch(
        self,
        sources: List[Dict[str, Any]],
        run_id: str
    ) -> Dict[str, Any]:
        """
        Executa coleta para multiplas fontes.
        
        Args:
            sources: Lista de configuracoes de fontes
            run_id: ID da execucao
        
        Returns:
            Resultado agregado
        """
        logger.info(
            "executing_batch",
            run_id=run_id,
            sources_count=len(sources)
        )
        
        results = []
        success_count = 0
        error_count = 0
        total_items = 0
        
        for source in sources:
            result = self.execute_source(source, run_id)
            results.append({
                'source_id': source.get('id'),
                'source_name': source.get('name'),
                **result
            })
            
            if result.get('success'):
                success_count += 1
                total_items += result.get('items_count', 0)
            else:
                error_count += 1
        
        summary = {
            'run_id': run_id,
            'total_sources': len(sources),
            'success_count': success_count,
            'error_count': error_count,
            'total_items': total_items,
            'results': results
        }
        
        logger.info(
            "batch_execution_complete",
            **{k: v for k, v in summary.items() if k != 'results'}
        )
        
        return summary
    
    # =========================================================================
    # HANDLERS ESPECIFICOS
    # =========================================================================
    
    def _handle_scrapy_cvm(
        self,
        source_config: Dict[str, Any],
        run_id: str
    ) -> Dict[str, Any]:
        """Handler para scrapers Scrapy tipo CVM API"""
        
        spider_name = source_config.get('spider_id', 'aneel_news')
        url_feed = source_config.get('url_feed')
        
        # Executar spider via Scrapy
        result = self.scraper.run_spider(
            spider_name=spider_name,
            args={
                'url': url_feed,
                'run_id': run_id
            }
        )
        
        return result
    
    def _handle_scrapy_newsroom(
        self,
        source_config: Dict[str, Any],
        run_id: str
    ) -> Dict[str, Any]:
        """Handler para scrapers Scrapy tipo Newsroom com player_id"""
        
        spider_name = source_config.get('spider_id', 'newsroom')
        url_feed = source_config.get('url_feed')
        player_id = source_config.get('player_id')
        
        result = self.scraper.run_spider(
            spider_name=spider_name,
            args={
                'url': url_feed,
                'player_id': player_id,
                'run_id': run_id
            }
        )
        
        return result
    
    def _handle_download_csv(
        self,
        source_config: Dict[str, Any],
        run_id: str
    ) -> Dict[str, Any]:
        """Handler para download direto de CSV"""
        
        # Usar Celery task para download
        result = self.celery.send_task(
            'download_csv',
            args=[source_config.get('url_feed'), run_id]
        )
        
        # Aguardar conclusao
        return self.celery.wait_for_task(result, timeout=300)
    
    def _handle_airflow_dag(
        self,
        source_config: Dict[str, Any],
        run_id: str
    ) -> Dict[str, Any]:
        """Handler para trigger de DAG Airflow especifico"""
        
        dag_id = source_config.get('dag_id')
        
        # Trigger DAG
        dag_run = self.airflow.trigger_dag(
            dag_id=dag_id,
            conf={
                'run_id': run_id,
                'source_config': source_config
            },
            run_id=f"{run_id}_{dag_id}"
        )
        
        # Aguardar conclusao
        final_status = self.airflow.wait_for_completion(
            dag_id=dag_id,
            dag_run_id=dag_run['dag_run_id'],
            timeout=1800  # 30 minutos
        )
        
        return {
            'success': final_status['state'] == 'success',
            'dag_run_id': dag_run['dag_run_id'],
            'state': final_status['state']
        }
    
    def _handle_custom_scraper(
        self,
        source_config: Dict[str, Any],
        run_id: str
    ) -> Dict[str, Any]:
        """Handler generico para scrapers customizados"""
        
        # Enviar para Celery task customizada
        task_name = source_config.get('task_name', 'custom_scrape')
        
        result = self.celery.send_task(
            task_name,
            kwargs={
                'source_config': source_config,
                'run_id': run_id
            }
        )
        
        return self.celery.wait_for_task(result, timeout=600)
    
    # =========================================================================
    # PROCESSAMENTO
    # =========================================================================
    
    def trigger_processing(
        self,
        document_ids: List[str],
        run_id: str
    ) -> List[Any]:
        """
        Dispara processamento de documentos coletados.
        
        Args:
            document_ids: Lista de IDs de documentos
            run_id: ID da execucao
        
        Returns:
            Lista de AsyncResults
        """
        logger.info(
            "triggering_document_processing",
            run_id=run_id,
            documents_count=len(document_ids)
        )
        
        results = []
        
        for doc_id in document_ids:
            result = self.celery.send_task(
                'process_document',
                args=[doc_id, run_id]
            )
            results.append(result)
        
        logger.info(
            "processing_tasks_sent",
            run_id=run_id,
            tasks_count=len(results)
        )
        
        return results
    
    def generate_gold_json(
        self,
        run_id: str,
        date: str
    ) -> Any:
        """
        Trigger task para gerar JSON Gold consolidado.
        
        Args:
            run_id: ID da execucao
            date: Data (YYYY-MM-DD)
        
        Returns:
            AsyncResult
        """
        logger.info(
            "triggering_gold_json_generation",
            run_id=run_id,
            date=date
        )
        
        result = self.celery.send_task(
            'generate_gold_json',
            kwargs={
                'run_id': run_id,
                'date': date
            }
        )
        
        return result

