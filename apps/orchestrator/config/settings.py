"""
AtlasReg Cursor - Settings e Configuracao
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    """Configuracoes do AtlasReg Cursor"""
    
    # Cloudflare API
    cf_api_endpoint: str = Field(
        default="https://api.cloudflare.com",
        description="Cloudflare API endpoint"
    )
    cf_api_token: Optional[str] = Field(
        default=None,
        description="Cloudflare API token"
    )
    cf_account_id: Optional[str] = Field(
        default=None,
        description="Cloudflare Account ID"
    )
    
    # Cloudflare Queue
    cf_queue_endpoint: Optional[str] = Field(
        default=None,
        description="Cloudflare Queue endpoint"
    )
    cf_queue_name: str = Field(
        default="ingest-queue",
        description="Nome da fila Cloudflare"
    )
    queue_poll_interval: int = Field(
        default=30,
        description="Intervalo de polling da fila (segundos)"
    )
    
    # Cloudflare KV
    cf_kv_api_endpoint: Optional[str] = Field(
        default=None,
        description="Cloudflare KV API endpoint"
    )
    cf_kv_namespace_id: Optional[str] = Field(
        default=None,
        description="KV Namespace ID"
    )
    
    # Cloudflare R2
    r2_endpoint: Optional[str] = Field(
        default=None,
        description="Cloudflare R2 endpoint"
    )
    r2_access_key: Optional[str] = Field(
        default=None,
        description="R2 access key ID"
    )
    r2_secret_key: Optional[str] = Field(
        default=None,
        description="R2 secret access key"
    )
    r2_bucket_name: str = Field(
        default="atlasreg-gold",
        description="R2 bucket para JSON Gold"
    )
    
    # Webhook / Hooks
    hook_hmac_secret: str = Field(
        default="dev-secret-change-in-production",
        description="HMAC secret para assinar webhooks"
    )
    hook_endpoint: Optional[str] = Field(
        default=None,
        description="Endpoint do webhook ingest-complete"
    )
    
    # AtlasReg Core - Celery
    celery_broker_url: str = Field(
        default="redis://redis:6379/1",
        description="Celery broker URL"
    )
    celery_result_backend: str = Field(
        default="redis://redis:6379/1",
        description="Celery result backend URL"
    )
    
    # AtlasReg Core - Airflow
    airflow_api_url: str = Field(
        default="http://airflow-webserver:8080",
        description="Airflow API URL"
    )
    airflow_username: str = Field(
        default="admin",
        description="Airflow username"
    )
    airflow_password: str = Field(
        default="admin",
        description="Airflow password"
    )
    
    # AtlasReg Core - Database
    database_url: str = Field(
        ...,
        description="PostgreSQL connection URL"
    )
    
    # AtlasReg Core - MinIO
    minio_endpoint: str = Field(
        default="minio:9000",
        description="MinIO endpoint"
    )
    minio_access_key: str = Field(
        default="admin",
        description="MinIO access key"
    )
    minio_secret_key: str = Field(
        default="atlasreg2025",
        description="MinIO secret key"
    )
    
    # AtlasReg Core - Elasticsearch
    elasticsearch_url: str = Field(
        default="http://elasticsearch:9200",
        description="Elasticsearch URL"
    )
    
    # AtlasReg Core - Redis (Cache)
    redis_url: str = Field(
        default="redis://redis:6379/2",
        description="Redis URL para cache do Cursor (DB 2)"
    )
    
    # Cursor Config
    mode: str = Field(
        default="standalone",
        description="Modo: standalone ou cloudflare"
    )
    log_level: str = Field(
        default="INFO",
        description="Log level"
    )
    worker_concurrency: int = Field(
        default=2,
        description="Numero de workers concorrentes"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Singleton
_settings = None

def get_settings() -> Settings:
    """Retorna instancia singleton de Settings"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings

