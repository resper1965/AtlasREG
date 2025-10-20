"""
Company Model
Representa empresas do setor de transmissão
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON
from sqlalchemy.sql import func

from app.database import Base

class Company(Base):
    """Empresa transmissora ou grupo econômico"""
    
    __tablename__ = "companies"
    
    # IDs
    id = Column(Integer, primary_key=True, index=True)
    cnpj = Column(String(18), unique=True, index=True)
    
    # Dados básicos
    name = Column(String(255), nullable=False, index=True)
    legal_name = Column(String(500))
    short_name = Column(String(100))
    
    # Hierarquia
    parent_group = Column(String(255), index=True)  # Grupo econômico
    is_group = Column(Boolean, default=False)  # É grupo ou empresa?
    
    # Classificação
    company_type = Column(String(50))  # transmissora, gerador, distribuidor, etc
    is_public = Column(Boolean, default=False)  # Capital aberto?
    stock_ticker = Column(String(10))  # B3: TAEE11, TRPL4, etc
    
    # Contato
    website = Column(String(500))
    email = Column(String(255))
    phone = Column(String(50))
    
    # Endereço
    address = Column(JSON)  # {"street": "...", "city": "...", "state": "...", "zip": "..."}
    headquarters_state = Column(String(2), index=True)  # SP, RJ, etc
    
    # Operacional
    total_lines_km = Column(Integer)  # km de linhas
    total_substations = Column(Integer)  # quantidade de subestações
    rap_annual = Column(Integer)  # RAP anual (R$ milhões)
    
    # SIGEL
    sigel_code = Column(String(50))
    aneel_code = Column(String(50))
    
    # Metadata
    aliases = Column(JSON)  # ["Nome Fantasia 1", "Nome Fantasia 2"]
    keywords = Column(JSON)  # Para busca
    
    # Status
    is_active = Column(Boolean, default=True, index=True)
    status_notes = Column(Text)
    
    # Timestamps
    founded_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Company {self.id}: {self.name}>"

