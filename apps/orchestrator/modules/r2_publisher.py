"""
AtlasReg Cursor - R2 Publisher
Upload de JSON Gold para Cloudflare R2 (ou MinIO)
"""

import boto3
import hashlib
import json
from typing import Dict, Any, Optional
from pathlib import Path
from datetime import datetime
from utils.retry import retry_network_call
from utils.logger import get_logger

logger = get_logger(__name__)


class R2Publisher:
    """Publisher para Cloudflare R2 (S3-compatible)"""
    
    def __init__(
        self,
        endpoint_url: str,
        access_key: str,
        secret_key: str,
        bucket_name: str = "atlasreg-gold",
        region: str = "auto"
    ):
        """
        Inicializa R2 client.
        
        Args:
            endpoint_url: R2 endpoint (ou MinIO)
            access_key: Access key ID
            secret_key: Secret access key
            bucket_name: Nome do bucket
            region: Regiao (auto para R2)
        """
        self.bucket_name = bucket_name
        
        # Inicializar boto3 client
        self.s3 = boto3.client(
            's3',
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
        
        # Garantir que bucket existe
        self._ensure_bucket()
    
    def _ensure_bucket(self) -> None:
        """Cria bucket se nao existir"""
        try:
            self.s3.head_bucket(Bucket=self.bucket_name)
            logger.debug("bucket_exists", bucket=self.bucket_name)
        except:
            try:
                self.s3.create_bucket(Bucket=self.bucket_name)
                logger.info("bucket_created", bucket=self.bucket_name)
            except Exception as e:
                logger.error("bucket_creation_failed", bucket=self.bucket_name, error=str(e))
    
    def calculate_sha256(self, data: Dict[str, Any]) -> str:
        """
        Calcula SHA256 hash do payload JSON.
        
        Args:
            data: Dicionario para hash
        
        Returns:
            Hash hexadecimal
        """
        # Serializar para JSON canonico
        json_bytes = json.dumps(
            data,
            sort_keys=True,
            separators=(',', ':'),
            ensure_ascii=False
        ).encode('utf-8')
        
        # Calcular SHA256
        return hashlib.sha256(json_bytes).hexdigest()
    
    @retry_network_call(max_attempts=3)
    def publish(
        self,
        data: Dict[str, Any],
        key: str,
        metadata: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Publica JSON Gold no R2.
        
        Args:
            data: Dados a publicar (sera convertido para JSON)
            key: Chave do objeto (path no bucket)
            metadata: Metadata adicional
        
        Returns:
            Dict com info da publicacao (key, sha256, size, etag)
        """
        logger.info("publishing_to_r2", key=key, bucket=self.bucket_name)
        
        # Calcular SHA256
        sha256_hash = self.calculate_sha256(data)
        
        # Serializar JSON
        json_bytes = json.dumps(
            data,
            indent=2,
            ensure_ascii=False
        ).encode('utf-8')
        
        # Preparar metadata
        upload_metadata = {
            'sha256': sha256_hash,
            'published_at': datetime.utcnow().isoformat(),
            'publisher': 'atlasreg-cursor',
            **(metadata or {})
        }
        
        # Upload para R2
        response = self.s3.put_object(
            Bucket=self.bucket_name,
            Key=key,
            Body=json_bytes,
            ContentType='application/json',
            Metadata=upload_metadata
        )
        
        result = {
            'bucket': self.bucket_name,
            'key': key,
            'sha256': sha256_hash,
            'size': len(json_bytes),
            'etag': response['ETag'].strip('"'),
            'version_id': response.get('VersionId'),
            'published_at': upload_metadata['published_at']
        }
        
        logger.info(
            "published_to_r2_success",
            **result
        )
        
        return result
    
    def get(self, key: str) -> Dict[str, Any]:
        """
        Busca objeto do R2.
        
        Args:
            key: Chave do objeto
        
        Returns:
            Dados parseados (JSON)
        """
        logger.debug("getting_from_r2", key=key)
        
        response = self.s3.get_object(
            Bucket=self.bucket_name,
            Key=key
        )
        
        data = json.loads(response['Body'].read().decode('utf-8'))
        
        logger.debug("got_from_r2_success", key=key)
        return data
    
    def list_objects(self, prefix: str = "") -> list:
        """
        Lista objetos no bucket.
        
        Args:
            prefix: Prefixo para filtrar
        
        Returns:
            Lista de keys
        """
        response = self.s3.list_objects_v2(
            Bucket=self.bucket_name,
            Prefix=prefix
        )
        
        return [obj['Key'] for obj in response.get('Contents', [])]
    
    def generate_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        """
        Gera URL pre-assinada para download.
        
        Args:
            key: Chave do objeto
            expires_in: Tempo de expiracao (segundos)
        
        Returns:
            URL pre-assinada
        """
        url = self.s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': key},
            ExpiresIn=expires_in
        )
        
        return url

