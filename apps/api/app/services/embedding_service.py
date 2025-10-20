"""
Serviço de Embeddings usando BERTimbau
Gera vetores de 768 dimensões para busca semântica
"""

import os
from typing import List, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session

from app.models.event import Event
from app.models.document import Document
from app.models.company import Company


class EmbeddingService:
    """
    Gera embeddings usando BERTimbau (português brasileiro)
    """
    
    def __init__(self):
        # Modelo otimizado para português
        # Alternativas:
        # - "neuralmind/bert-base-portuguese-cased" (768 dim)
        # - "sentence-transformers/paraphrase-multilingual-mpnet-base-v2" (768 dim)
        # - "rufimelo/Legal-BERTimbau-sts-base" (768 dim - legal/regulatório)
        
        model_name = os.getenv(
            "EMBEDDING_MODEL",
            "neuralmind/bert-base-portuguese-cased"
        )
        
        print(f"🧠 Carregando modelo de embeddings: {model_name}")
        self.model = SentenceTransformer(model_name)
        print(f"✅ Modelo carregado! Dimensão: {self.model.get_sentence_embedding_dimension()}")
    
    def encode_text(self, text: str) -> List[float]:
        """
        Gera embedding para um texto
        
        Args:
            text: Texto em português
            
        Returns:
            Vetor de 768 dimensões
        """
        if not text or not text.strip():
            return [0.0] * 768  # Vetor zero para textos vazios
        
        # Gerar embedding
        embedding = self.model.encode(text, convert_to_numpy=True)
        
        # Converter para lista (pgvector aceita)
        return embedding.tolist()
    
    def encode_batch(self, texts: List[str], batch_size: int = 32) -> List[List[float]]:
        """
        Gera embeddings em lote (mais eficiente)
        
        Args:
            texts: Lista de textos
            batch_size: Tamanho do lote
            
        Returns:
            Lista de vetores
        """
        if not texts:
            return []
        
        # Processar em lotes
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=True,
            convert_to_numpy=True
        )
        
        return [emb.tolist() for emb in embeddings]
    
    def generate_event_embedding(self, event: Event) -> List[float]:
        """
        Gera embedding para um evento
        
        Combina: título + descrição + análise (se houver)
        """
        text_parts = [event.title]
        
        if event.description:
            text_parts.append(event.description)
        
        if hasattr(event, 'analysis') and event.analysis:
            text_parts.append(event.analysis)
        
        # Combinar com espaço
        combined_text = " ".join(text_parts)
        
        return self.encode_text(combined_text)
    
    def generate_document_embedding(self, document: Document) -> List[float]:
        """
        Gera embedding para um documento
        
        Combina: título + conteúdo (primeiros 512 tokens)
        """
        text_parts = [document.title]
        
        if document.content:
            # Limitar tamanho (modelo tem limite de tokens)
            content_preview = document.content[:2000]  # ~500 tokens
            text_parts.append(content_preview)
        
        combined_text = " ".join(text_parts)
        
        return self.encode_text(combined_text)
    
    def generate_company_embedding(self, company: Company) -> List[float]:
        """
        Gera embedding para descrição de empresa
        """
        text_parts = [company.name]
        
        if hasattr(company, 'description') and company.description:
            text_parts.append(company.description)
        
        # Adicionar características numéricas como texto
        # (ajuda na busca semântica)
        if hasattr(company, 'rap_anual') and company.rap_anual:
            text_parts.append(f"RAP anual de {company.rap_anual}")
        
        combined_text = " ".join(text_parts)
        
        return self.encode_text(combined_text)
    
    def populate_event_embeddings(self, db: Session, batch_size: int = 100):
        """
        Popula embeddings de todos os eventos no banco
        
        Args:
            db: Sessão do banco
            batch_size: Quantos eventos processar por vez
        """
        print("📊 Populando embeddings de eventos...")
        
        # Buscar eventos sem embedding
        events = db.query(Event).filter(Event.embedding == None).all()
        
        if not events:
            print("✅ Todos os eventos já têm embeddings!")
            return
        
        print(f"🔄 Processando {len(events)} eventos...")
        
        # Processar em lotes
        for i in range(0, len(events), batch_size):
            batch = events[i:i + batch_size]
            
            # Preparar textos
            texts = []
            for event in batch:
                text_parts = [event.title]
                if event.description:
                    text_parts.append(event.description)
                texts.append(" ".join(text_parts))
            
            # Gerar embeddings em lote
            embeddings = self.encode_batch(texts)
            
            # Atualizar banco
            for event, embedding in zip(batch, embeddings):
                event.embedding = embedding
            
            db.commit()
            
            print(f"  ✓ {i + len(batch)}/{len(events)} eventos processados")
        
        print("✅ Embeddings de eventos populados!")
    
    def populate_document_embeddings(self, db: Session, batch_size: int = 50):
        """
        Popula embeddings de todos os documentos
        """
        print("📄 Populando embeddings de documentos...")
        
        documents = db.query(Document).filter(Document.embedding == None).all()
        
        if not documents:
            print("✅ Todos os documentos já têm embeddings!")
            return
        
        print(f"🔄 Processando {len(documents)} documentos...")
        
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            
            texts = []
            for doc in batch:
                text_parts = [doc.title]
                if doc.content:
                    text_parts.append(doc.content[:2000])
                texts.append(" ".join(text_parts))
            
            embeddings = self.encode_batch(texts)
            
            for doc, embedding in zip(batch, embeddings):
                doc.embedding = embedding
            
            db.commit()
            
            print(f"  ✓ {i + len(batch)}/{len(documents)} documentos processados")
        
        print("✅ Embeddings de documentos populados!")
    
    def populate_all_embeddings(self, db: Session):
        """
        Popula embeddings de todas as entidades
        """
        print("\n🚀 Iniciando população de embeddings...")
        print("=" * 50)
        
        self.populate_event_embeddings(db)
        self.populate_document_embeddings(db)
        
        print("=" * 50)
        print("✅ TODOS os embeddings populados com sucesso!")
        print("\n🔍 Sistema de busca semântica pronto!")


# Singleton para reusar modelo (carregamento é lento)
_embedding_service_instance: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    """
    Retorna instância singleton do serviço de embeddings
    """
    global _embedding_service_instance
    
    if _embedding_service_instance is None:
        _embedding_service_instance = EmbeddingService()
    
    return _embedding_service_instance

