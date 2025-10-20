"""Configuration settings for AtlasReg API"""

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "AtlasReg by ness."
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    
    # Auth
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3100",
        "http://localhost:8100"
    ]
    
    # MinIO
    MINIO_ENDPOINT: str = "localhost:19000"
    MINIO_ACCESS_KEY: str = "admin"
    MINIO_SECRET_KEY: str = "atlasreg2025"
    MINIO_SECURE: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6381/0"
    
    # Elasticsearch
    ELASTICSEARCH_URL: str = "http://localhost:19200"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

