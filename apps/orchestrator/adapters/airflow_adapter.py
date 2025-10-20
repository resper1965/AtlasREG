"""
AtlasReg Cursor - Airflow Adapter
Trigger DAGs via Airflow REST API
"""

import requests
from requests.auth import HTTPBasicAuth
from typing import Dict, Any, Optional
import time
from utils.retry import retry_network_call
from utils.logger import get_logger

logger = get_logger(__name__)


class AirflowAdapter:
    """Adapter para Airflow REST API"""
    
    def __init__(
        self,
        api_url: str,
        username: str,
        password: str
    ):
        """
        Inicializa adapter.
        
        Args:
            api_url: URL da API Airflow
            username: Username
            password: Password
        """
        self.api_url = api_url.rstrip('/')
        self.auth = HTTPBasicAuth(username, password)
    
    @retry_network_call(max_attempts=3)
    def trigger_dag(
        self,
        dag_id: str,
        conf: Optional[Dict[str, Any]] = None,
        run_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Trigger DAG via API.
        
        Args:
            dag_id: ID do DAG
            conf: Configuracao a passar para o DAG
            run_id: Run ID customizado (opcional)
        
        Returns:
            DAG run info
        """
        url = f"{self.api_url}/api/v1/dags/{dag_id}/dagRuns"
        
        payload = {
            'conf': conf or {},
        }
        
        if run_id:
            payload['dag_run_id'] = run_id
        
        logger.info("triggering_dag", dag_id=dag_id, run_id=run_id)
        
        response = requests.post(
            url,
            json=payload,
            auth=self.auth,
            timeout=30
        )
        
        response.raise_for_status()
        result = response.json()
        
        logger.info(
            "dag_triggered_success",
            dag_id=dag_id,
            dag_run_id=result.get('dag_run_id'),
            state=result.get('state')
        )
        
        return result
    
    @retry_network_call(max_attempts=5)
    def get_dag_run_status(
        self,
        dag_id: str,
        dag_run_id: str
    ) -> Dict[str, Any]:
        """
        Verifica status de DAG run.
        
        Args:
            dag_id: ID do DAG
            dag_run_id: ID do run
        
        Returns:
            Status info
        """
        url = f"{self.api_url}/api/v1/dags/{dag_id}/dagRuns/{dag_run_id}"
        
        response = requests.get(
            url,
            auth=self.auth,
            timeout=10
        )
        
        response.raise_for_status()
        return response.json()
    
    def wait_for_completion(
        self,
        dag_id: str,
        dag_run_id: str,
        timeout: int = 3600,
        poll_interval: int = 10
    ) -> Dict[str, Any]:
        """
        Aguarda conclusao de DAG run.
        
        Args:
            dag_id: ID do DAG
            dag_run_id: ID do run
            timeout: Timeout maximo (segundos)
            poll_interval: Intervalo de polling (segundos)
        
        Returns:
            Status final do DAG run
        
        Raises:
            TimeoutError: Se exceder timeout
            RuntimeError: Se DAG falhar
        """
        logger.info(
            "waiting_for_dag_completion",
            dag_id=dag_id,
            dag_run_id=dag_run_id,
            timeout=timeout
        )
        
        start_time = time.time()
        
        while True:
            elapsed = time.time() - start_time
            
            if elapsed > timeout:
                raise TimeoutError(
                    f"DAG {dag_id} run {dag_run_id} exceeded timeout {timeout}s"
                )
            
            status = self.get_dag_run_status(dag_id, dag_run_id)
            state = status.get('state')
            
            logger.debug(
                "dag_status_check",
                dag_id=dag_id,
                state=state,
                elapsed=f"{elapsed:.1f}s"
            )
            
            if state == 'success':
                logger.info(
                    "dag_completed_success",
                    dag_id=dag_id,
                    dag_run_id=dag_run_id,
                    duration=f"{elapsed:.1f}s"
                )
                return status
            
            elif state == 'failed':
                logger.error(
                    "dag_failed",
                    dag_id=dag_id,
                    dag_run_id=dag_run_id
                )
                raise RuntimeError(f"DAG {dag_id} run failed")
            
            elif state in ['running', 'queued']:
                # Continuar aguardando
                time.sleep(poll_interval)
            
            else:
                logger.warning(
                    "dag_unknown_state",
                    dag_id=dag_id,
                    state=state
                )
                time.sleep(poll_interval)
    
    def list_dags(self) -> list:
        """
        Lista DAGs disponiveis.
        
        Returns:
            Lista de DAGs
        """
        url = f"{self.api_url}/api/v1/dags"
        
        response = requests.get(
            url,
            auth=self.auth,
            timeout=10
        )
        
        response.raise_for_status()
        result = response.json()
        
        return result.get('dags', [])

