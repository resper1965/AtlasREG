"""
Serviço de Busca Semântica usando pgvector
Combina busca vetorial + filtros SQL
"""

from typing import List, Optional, Dict, Any
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.models.event import Event, EventoTipo, Severidade
from app.services.embedding_service import get_embedding_service


class SearchService:
    """
    Busca semântica híbrida:
    1. Gera embedding da query
    2. Busca vetorial (pgvector)
    3. Aplica filtros estruturados
    4. Ranking híbrido
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.embedding_service = get_embedding_service()
    
    def search_events(
        self,
        query: Optional[str] = None,
        tipo: Optional[EventoTipo] = None,
        severidade: Optional[Severidade] = None,
        empresa: Optional[str] = None,
        data_inicio: Optional[date] = None,
        data_fim: Optional[date] = None,
        valor_min: Optional[float] = None,
        valor_max: Optional[float] = None,
        match_threshold: float = 0.7,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Busca eventos com filtros e/ou busca semântica
        
        Args:
            query: Texto para busca semântica (opcional)
            tipo: Filtro por tipo de evento
            severidade: Filtro por severidade
            empresa: Nome da empresa (LIKE)
            data_inicio: Data mínima
            data_fim: Data máxima
            valor_min: Valor mínimo (R$)
            valor_max: Valor máximo (R$)
            match_threshold: Threshold de similaridade (0-1)
            limit: Máximo de resultados
            
        Returns:
            Lista de eventos com score de similaridade
        """
        
        # CASO 1: Busca semântica (com query)
        if query and query.strip():
            return self._search_semantic(
                query=query,
                tipo=tipo,
                severidade=severidade,
                empresa=empresa,
                data_inicio=data_inicio,
                data_fim=data_fim,
                valor_min=valor_min,
                valor_max=valor_max,
                match_threshold=match_threshold,
                limit=limit
            )
        
        # CASO 2: Apenas filtros (sem query)
        else:
            return self._search_filtered(
                tipo=tipo,
                severidade=severidade,
                empresa=empresa,
                data_inicio=data_inicio,
                data_fim=data_fim,
                valor_min=valor_min,
                valor_max=valor_max,
                limit=limit
            )
    
    def _search_semantic(
        self,
        query: str,
        tipo: Optional[EventoTipo] = None,
        severidade: Optional[Severidade] = None,
        empresa: Optional[str] = None,
        data_inicio: Optional[date] = None,
        data_fim: Optional[date] = None,
        valor_min: Optional[float] = None,
        valor_max: Optional[float] = None,
        match_threshold: float = 0.7,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Busca semântica com filtros
        """
        # 1. Gerar embedding da query
        query_embedding = self.embedding_service.encode_text(query)
        
        # 2. Busca vetorial usando função SQL
        sql = text("""
            SELECT 
                id,
                title,
                description,
                tipo,
                severidade,
                sentimento,
                data,
                valor,
                companies,
                sources,
                analysis,
                1 - (embedding <=> :query_embedding) as similarity
            FROM events
            WHERE embedding IS NOT NULL
                AND 1 - (embedding <=> :query_embedding) > :threshold
                AND (:tipo IS NULL OR tipo = :tipo)
                AND (:severidade IS NULL OR severidade = :severidade)
                AND (:empresa IS NULL OR companies ILIKE :empresa_pattern)
                AND (:data_inicio IS NULL OR data >= :data_inicio)
                AND (:data_fim IS NULL OR data <= :data_fim)
                AND (:valor_min IS NULL OR valor >= :valor_min)
                AND (:valor_max IS NULL OR valor <= :valor_max)
            ORDER BY embedding <=> :query_embedding
            LIMIT :limit
        """)
        
        # 3. Executar query
        result = self.db.execute(sql, {
            'query_embedding': str(query_embedding),  # pgvector aceita string
            'threshold': match_threshold,
            'tipo': tipo.value if tipo else None,
            'severidade': severidade.value if severidade else None,
            'empresa': empresa,
            'empresa_pattern': f'%{empresa}%' if empresa else None,
            'data_inicio': data_inicio,
            'data_fim': data_fim,
            'valor_min': valor_min,
            'valor_max': valor_max,
            'limit': limit
        })
        
        # 4. Formatar resultados
        events = []
        for row in result:
            events.append({
                'id': row.id,
                'title': row.title,
                'description': row.description,
                'tipo': row.tipo,
                'severidade': row.severidade,
                'sentimento': row.sentimento,
                'data': row.data.isoformat() if row.data else None,
                'valor': float(row.valor) if row.valor else None,
                'companies': row.companies,
                'sources': row.sources,
                'analysis': row.analysis,
                'similarity': float(row.similarity)  # Score de relevância
            })
        
        return events
    
    def _search_filtered(
        self,
        tipo: Optional[EventoTipo] = None,
        severidade: Optional[Severidade] = None,
        empresa: Optional[str] = None,
        data_inicio: Optional[date] = None,
        data_fim: Optional[date] = None,
        valor_min: Optional[float] = None,
        valor_max: Optional[float] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Busca apenas por filtros (sem embedding)
        """
        query = self.db.query(Event)
        
        # Aplicar filtros
        if tipo:
            query = query.filter(Event.tipo == tipo)
        
        if severidade:
            query = query.filter(Event.severidade == severidade)
        
        if empresa:
            query = query.filter(Event.companies.ilike(f'%{empresa}%'))
        
        if data_inicio:
            query = query.filter(Event.data >= data_inicio)
        
        if data_fim:
            query = query.filter(Event.data <= data_fim)
        
        if valor_min:
            query = query.filter(Event.valor >= valor_min)
        
        if valor_max:
            query = query.filter(Event.valor <= valor_max)
        
        # Ordenar por data (mais recente)
        query = query.order_by(Event.data.desc())
        
        # Limitar resultados
        query = query.limit(limit)
        
        # Executar
        results = query.all()
        
        # Formatar
        events = []
        for event in results:
            events.append({
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'tipo': event.tipo.value,
                'severidade': event.severidade.value,
                'sentimento': event.sentimento.value if event.sentimento else None,
                'data': event.data.isoformat() if event.data else None,
                'valor': float(event.valor) if event.valor else None,
                'companies': event.companies,
                'sources': event.sources,
                'analysis': event.analysis,
                'similarity': None  # Sem busca semântica
            })
        
        return events
    
    def search_similar_to_event(
        self,
        event_id: int,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Busca eventos similares a um evento específico
        
        Args:
            event_id: ID do evento de referência
            limit: Máximo de resultados
            
        Returns:
            Eventos similares (excluindo o próprio)
        """
        # Buscar evento de referência
        event = self.db.query(Event).filter(Event.id == event_id).first()
        
        if not event or not event.embedding:
            return []
        
        # Buscar similares usando o embedding do evento
        sql = text("""
            SELECT 
                id,
                title,
                description,
                tipo,
                severidade,
                data,
                valor,
                companies,
                1 - (embedding <=> :ref_embedding) as similarity
            FROM events
            WHERE id != :event_id
                AND embedding IS NOT NULL
            ORDER BY embedding <=> :ref_embedding
            LIMIT :limit
        """)
        
        result = self.db.execute(sql, {
            'ref_embedding': str(event.embedding),
            'event_id': event_id,
            'limit': limit
        })
        
        # Formatar
        similar_events = []
        for row in result:
            similar_events.append({
                'id': row.id,
                'title': row.title,
                'description': row.description,
                'tipo': row.tipo,
                'severidade': row.severidade,
                'data': row.data.isoformat() if row.data else None,
                'valor': float(row.valor) if row.valor else None,
                'companies': row.companies,
                'similarity': float(row.similarity)
            })
        
        return similar_events

