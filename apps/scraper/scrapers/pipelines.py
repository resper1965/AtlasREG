"""
Scrapy Pipelines
Processa items coletados: salva em MinIO, PostgreSQL, dispara processamento
"""

from minio import Minio
from minio.error import S3Error
import json
import re
from datetime import datetime
import hashlib

class MinIOPipeline:
    """Pipeline para salvar documentos brutos no MinIO"""
    
    def open_spider(self, spider):
        """Inicializar conexão MinIO"""
        
        # TODO: Ler de config/env
        self.minio = Minio(
            'localhost:19000',
            access_key='admin',
            secret_key='atlasreg2025',
            secure=False
        )
        
        # Garantir bucket existe
        bucket_name = 'raw-documents'
        if not self.minio.bucket_exists(bucket_name):
            self.minio.make_bucket(bucket_name)
            spider.logger.info(f"📦 Bucket {bucket_name} criado")
        
        self.bucket_name = bucket_name
        spider.logger.info("📦 MinIO Pipeline inicializado")
    
    def process_item(self, item, spider):
        """Salvar item no MinIO"""
        
        try:
            # Gerar filename único
            date_str = item.get('date', '')[:10] if item.get('date') else 'unknown'
            source_id = item.get('source_id', 'unknown')
            
            # Sanitize título para filename
            title_clean = re.sub(r'[^\w\s-]', '', item['title'][:80])
            title_clean = re.sub(r'\s+', '-', title_clean.strip())
            
            # Hash para garantir unicidade
            content_hash = hashlib.md5(item['url'].encode()).hexdigest()[:8]
            
            filename = f"{source_id}/{date_str}/{title_clean}-{content_hash}.json"
            
            # Converter para JSON
            data = json.dumps(item, ensure_ascii=False, indent=2)
            data_bytes = data.encode('utf-8')
            
            # Upload
            self.minio.put_object(
                self.bucket_name,
                filename,
                data_bytes,
                len(data_bytes),
                content_type='application/json'
            )
            
            spider.logger.info(f"💾 Salvo em MinIO: {filename}")
            
            # Adicionar info do storage ao item
            item['minio_key'] = filename
            item['minio_bucket'] = self.bucket_name
            
        except S3Error as e:
            spider.logger.error(f"❌ Erro MinIO: {e}")
        
        return item


class PostgreSQLPipeline:
    """Pipeline para registrar metadata no PostgreSQL"""
    
    def open_spider(self, spider):
        """Inicializar conexão database"""
        # TODO: Implementar com SQLAlchemy
        spider.logger.info("🗄️  PostgreSQL Pipeline inicializado")
    
    def process_item(self, item, spider):
        """Registrar documento no PostgreSQL"""
        
        try:
            # TODO: Implementar
            # from app.database import SessionLocal
            # from app.models.document import Document
            # 
            # db = SessionLocal()
            # document = Document(
            #     filename=item['minio_key'],
            #     source=item['source_id'],
            #     doc_type=item['category'],
            #     status='raw',
            #     scraped_at=datetime.now(),
            #     url=item['url']
            # )
            # db.add(document)
            # db.commit()
            
            spider.logger.info(f"🗄️  Registrado: {item['title'][:50]}...")
            
        except Exception as e:
            spider.logger.error(f"❌ Erro PostgreSQL: {e}")
        
        return item


class ProcessingTriggerPipeline:
    """Pipeline para disparar processamento de IA"""
    
    def process_item(self, item, spider):
        """Disparar Celery task para processar documento"""
        
        try:
            # TODO: Implementar
            # from tasks import process_document
            # process_document.delay(item['minio_key'])
            
            spider.logger.info(f"🤖 Processamento disparado: {item['title'][:50]}...")
            
        except Exception as e:
            spider.logger.error(f"❌ Erro ao disparar processamento: {e}")
        
        return item

