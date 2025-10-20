"""
Document Model
Representa documentos coletados e processados
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON, Enum as SQLEnum
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.database import Base

class DocumentStatus(enum.Enum):
    """Status do documento no pipeline"""
    RAW = "raw"                      # Coletado, não processado
    PROCESSING = "processing"        # Em processamento
    PROCESSED = "processed"          # Processado com sucesso
    FAILED = "failed"                # Falha no processamento
    DUPLICATE = "duplicate"          # Duplicado (ignorado)

class DocumentType(enum.Enum):
    """Tipo de documento"""
    NEWS = "news"                    # Notícia
    REGULATION = "regulation"        # Decisão regulatória
    FINE = "fine"                    # Multa/PV
    INCIDENT = "incident"            # Ocorrência operacional
    TRANSACTION = "transaction"      # Transação M&A
    REPORT = "report"                # Relatório técnico
    OTHER = "other"

class Document(Base):
    """Documento coletado e processado"""
    
    __tablename__ = "documents"
    
    # IDs
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(255), unique=True, index=True)  # Hash da URL
    
    # Metadata básica
    title = Column(String(500), nullable=False)
    url = Column(String(1000), nullable=False, index=True)
    source = Column(String(100), nullable=False, index=True)  # source_id do YAML
    category = Column(String(50), index=True)  # regulatorio, midia, etc
    
    # Conteúdo
    summary = Column(Text)
    body = Column(Text)
    raw_html = Column(Text)
    
    # Storage
    minio_bucket = Column(String(100))
    minio_key = Column(String(500))
    
    # Classificação (IA)
    doc_type = Column(SQLEnum(DocumentType), default=DocumentType.OTHER, index=True)
    confidence = Column(Integer, default=0)  # 0-100
    
    # Entidades extraídas (JSON)
    entities = Column(JSON)  # {"companies": [], "values": [], "dates": []}
    keywords = Column(JSON)  # ["transmissão", "outorga", ...]
    
    # Anexos
    attachments = Column(JSON)  # [{"type": "pdf", "url": "...", "minio_key": "..."}]
    
    # Status
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.RAW, index=True)
    processing_error = Column(Text)
    
    # Flags
    is_relevant = Column(Boolean, default=True)
    is_duplicate = Column(Boolean, default=False)
    requires_attention = Column(Boolean, default=False)
    
    # Timestamps
    published_at = Column(DateTime, index=True)
    scraped_at = Column(DateTime, default=func.now())
    processed_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Metrics
    word_count = Column(Integer, default=0)
    reading_time = Column(Integer, default=0)  # minutos
    
    def __repr__(self):
        return f"<Document {self.id}: {self.title[:50]}...>"
    
    @property
    def is_processed(self):
        return self.status == DocumentStatus.PROCESSED
    
    @property
    def needs_processing(self):
        return self.status == DocumentStatus.RAW

