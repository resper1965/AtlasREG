"""Add pgvector embeddings

Revision ID: 003
Revises: 002
Create Date: 2025-10-18 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    # Habilitar extensão pgvector
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    
    # Adicionar coluna embedding na tabela events
    op.add_column('events',
        sa.Column('embedding', Vector(768), nullable=True)
    )
    
    # Adicionar coluna embedding na tabela documents
    op.add_column('documents',
        sa.Column('embedding', Vector(768), nullable=True)
    )
    
    # Adicionar coluna embedding na tabela companies
    op.add_column('companies',
        sa.Column('description_embedding', Vector(768), nullable=True)
    )
    
    # Criar índices para busca vetorial rápida
    # IVFFlat: ideal para datasets médios (10k-1M vetores)
    op.execute('''
        CREATE INDEX events_embedding_idx 
        ON events USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
    ''')
    
    op.execute('''
        CREATE INDEX documents_embedding_idx 
        ON documents USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
    ''')
    
    op.execute('''
        CREATE INDEX companies_description_embedding_idx 
        ON companies USING ivfflat (description_embedding vector_cosine_ops)
        WITH (lists = 50)
    ''')
    
    # Criar função de busca semântica para eventos
    op.execute('''
        CREATE OR REPLACE FUNCTION search_similar_events(
            query_embedding vector(768),
            match_threshold float DEFAULT 0.7,
            match_count int DEFAULT 10
        )
        RETURNS TABLE (
            id int,
            title text,
            description text,
            tipo text,
            severidade text,
            data date,
            valor numeric,
            similarity float
        )
        LANGUAGE sql STABLE
        AS $$
          SELECT 
            events.id,
            events.title,
            events.description,
            events.tipo,
            events.severidade,
            events.data,
            events.valor,
            1 - (events.embedding <=> query_embedding) as similarity
          FROM events
          WHERE events.embedding IS NOT NULL
            AND 1 - (events.embedding <=> query_embedding) > match_threshold
          ORDER BY events.embedding <=> query_embedding
          LIMIT match_count;
        $$;
    ''')
    
    # Criar função de busca para documentos
    op.execute('''
        CREATE OR REPLACE FUNCTION search_similar_documents(
            query_embedding vector(768),
            match_threshold float DEFAULT 0.7,
            match_count int DEFAULT 5
        )
        RETURNS TABLE (
            id int,
            title text,
            content text,
            source text,
            similarity float
        )
        LANGUAGE sql STABLE
        AS $$
          SELECT 
            documents.id,
            documents.title,
            documents.content,
            documents.source,
            1 - (documents.embedding <=> query_embedding) as similarity
          FROM documents
          WHERE documents.embedding IS NOT NULL
            AND 1 - (documents.embedding <=> query_embedding) > match_threshold
          ORDER BY documents.embedding <=> query_embedding
          LIMIT match_count;
        $$;
    ''')


def downgrade():
    # Remover funções
    op.execute('DROP FUNCTION IF EXISTS search_similar_events')
    op.execute('DROP FUNCTION IF EXISTS search_similar_documents')
    
    # Remover índices
    op.execute('DROP INDEX IF EXISTS events_embedding_idx')
    op.execute('DROP INDEX IF EXISTS documents_embedding_idx')
    op.execute('DROP INDEX IF EXISTS companies_description_embedding_idx')
    
    # Remover colunas
    op.drop_column('events', 'embedding')
    op.drop_column('documents', 'embedding')
    op.drop_column('companies', 'description_embedding')
    
    # Remover extensão (cuidado em produção!)
    op.execute('DROP EXTENSION IF EXISTS vector')

