"""
Event Model
Representa eventos extraídos de documentos
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database import Base

class EventType(enum.Enum):
    """Tipos de eventos"""
    REGULATORY_DECISION = "regulatory_decision"    # Decisão regulatória
    FINE = "fine"                                  # Multa aplicada
    LICENSE_GRANTED = "license_granted"            # Outorga concedida
    LICENSE_EXPIRED = "license_expired"            # Outorga vencida
    TARIFF_ADJUSTMENT = "tariff_adjustment"        # Reajuste tarifário
    MA_TRANSACTION = "ma_transaction"              # Transação M&A
    OPERATIONAL_INCIDENT = "operational_incident"  # Incidente operacional
    NEW_PROJECT = "new_project"                    # Novo projeto anunciado
    PROJECT_DELAYED = "project_delayed"            # Projeto atrasado
    COMPANY_NEWS = "company_news"                  # Notícia sobre empresa
    MARKET_UPDATE = "market_update"                # Atualização de mercado
    OTHER = "other"

class EventSeverity(enum.Enum):
    """Severidade do evento"""
    CRITICAL = "critical"  # Requer ação imediata
    HIGH = "high"          # Importante
    MEDIUM = "medium"      # Normal
    LOW = "low"            # Informativo

class Event(Base):
    """Evento de mercado extraído de documentos"""
    
    __tablename__ = "events"
    
    # IDs
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, index=True)
    
    # Metadata
    title = Column(String(500), nullable=False)
    description = Column(Text)
    event_type = Column(SQLEnum(EventType), nullable=False, index=True)
    severity = Column(SQLEnum(EventSeverity), default=EventSeverity.MEDIUM, index=True)
    
    # Entidades relacionadas
    companies = Column(JSON)  # [{"name": "Transmissora X", "cnpj": "..."}]
    locations = Column(JSON)  # [{"state": "SP", "city": "São Paulo"}]
    values = Column(JSON)     # [{"amount": 1500000, "currency": "BRL", "type": "multa"}]
    
    # Datas importantes
    event_date = Column(DateTime, index=True)  # Data do evento
    deadline_date = Column(DateTime)           # Prazo (se aplicável)
    
    # Classificação
    tags = Column(JSON)  # ["transmissão", "multa", "ANEEL"]
    confidence = Column(Integer, default=0)  # 0-100 (confiança da IA)
    
    # Flags
    is_verified = Column(Boolean, default=False)
    requires_action = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    
    # Embeddings para busca semântica
    embedding_vector = Column(JSON)  # Será migrado para pgvector no futuro
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    document = relationship("Document", backref="events")
    
    def __repr__(self):
        return f"<Event {self.id}: {self.event_type.value} - {self.title[:30]}...>"

