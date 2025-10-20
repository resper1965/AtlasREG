"""
AtlasReg Cursor - Cloudflare KV Config Client
Le configuracao do Cloudflare KV
"""

import requests
import json
from typing import Dict, Any, Optional
from pathlib import Path
from utils.retry import retry_network_call
from utils.logger import get_logger

logger = get_logger(__name__)


class CFConfigClient:
    """Cliente para Cloudflare KV (ou fallback local)"""
    
    def __init__(
        self,
        kv_api_endpoint: Optional[str] = None,
        kv_namespace_id: Optional[str] = None,
        api_token: Optional[str] = None,
        fallback_file: str = "config/news_watchlist_config.json"
    ):
        """
        Inicializa client KV.
        
        Args:
            kv_api_endpoint: Endpoint da API KV
            kv_namespace_id: Namespace ID
            api_token: Token de autenticacao
            fallback_file: Arquivo local como fallback
        """
        self.kv_api_endpoint = kv_api_endpoint
        self.kv_namespace_id = kv_namespace_id
        self.api_token = api_token
        self.fallback_file = Path(__file__).parent.parent / fallback_file
        
        # Cache da config
        self._config_cache: Optional[Dict[str, Any]] = None
        self._cache_timestamp: Optional[float] = None
        self._cache_ttl: int = 300  # 5 minutos
    
    @retry_network_call(max_attempts=3)
    def get_config(self, key: str = "NEWS_WATCHLIST_CONFIG") -> Dict[str, Any]:
        """
        Busca configuracao do KV (ou fallback local).
        
        Args:
            key: Chave no KV
        
        Returns:
            Config dict
        """
        import time
        
        # Verificar cache
        if self._config_cache and self._cache_timestamp:
            age = time.time() - self._cache_timestamp
            if age < self._cache_ttl:
                logger.debug("config_cache_hit", key=key, age=age)
                return self._config_cache
        
        # Tentar buscar do Cloudflare KV
        if self.kv_api_endpoint and self.kv_namespace_id and self.api_token:
            try:
                config = self._fetch_from_kv(key)
                self._update_cache(config)
                logger.info("config_loaded_from_kv", key=key)
                return config
            except Exception as e:
                logger.warning(
                    "kv_fetch_failed_fallback_to_local",
                    key=key,
                    error=str(e)
                )
        
        # Fallback: arquivo local
        config = self._load_from_file()
        self._update_cache(config)
        logger.info("config_loaded_from_file", file=str(self.fallback_file))
        return config
    
    def _fetch_from_kv(self, key: str) -> Dict[str, Any]:
        """Busca do Cloudflare KV via API"""
        
        url = f"{self.kv_api_endpoint}/accounts/{self.kv_namespace_id}/storage/kv/namespaces/{self.kv_namespace_id}/values/{key}"
        
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        return response.json()
    
    def _load_from_file(self) -> Dict[str, Any]:
        """Carrega config de arquivo local"""
        
        if not self.fallback_file.exists():
            logger.error("fallback_file_not_found", file=str(self.fallback_file))
            # Retornar config minima
            return self._get_default_config()
        
        with open(self.fallback_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _update_cache(self, config: Dict[str, Any]) -> None:
        """Atualiza cache interno"""
        import time
        self._config_cache = config
        self._cache_timestamp = time.time()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Retorna configuracao padrao minima"""
        return {
            "sources": [],
            "global_settings": {
                "alert_recipients": ["admin@atlasreg.com"],
                "alert_on_zero_results": True
            }
        }
    
    def refresh_config(self) -> Dict[str, Any]:
        """Forca refresh da config (ignora cache)"""
        self._config_cache = None
        self._cache_timestamp = None
        return self.get_config()

