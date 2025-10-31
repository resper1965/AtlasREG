-- Migration: Initial Schema para AtlasREG
-- Criado em: 2025-10-31
-- Descrição: Cria tabelas de usuários, organizações e permissões

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: profiles
-- Perfil de usuário sincronizado com auth.users
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por email
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- TABELA: organizations
-- Organizações (multi-tenancy)
-- =====================================================
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por slug
CREATE INDEX idx_organizations_slug ON public.organizations(slug);

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver organizações das quais são membros
CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
    )
  );

-- =====================================================
-- ENUM: user_role
-- Papéis de usuários no sistema
-- =====================================================
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'editor', 'viewer', 'member');

-- =====================================================
-- TABELA: organization_members
-- Membros de organizações com seus papéis
-- =====================================================
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Índices para performance
CREATE INDEX idx_org_members_org_id ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_org_members_role ON public.organization_members(role);

-- RLS
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver membros de organizações que pertencem
CREATE POLICY "Users can view organization members"
  ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Policy: Apenas admins podem adicionar membros
CREATE POLICY "Admins can insert organization members"
  ON public.organization_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================
-- TABELA: permissions
-- Permissões disponíveis no sistema
-- =====================================================
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Policy: Todos podem ver permissões
CREATE POLICY "Everyone can view permissions"
  ON public.permissions FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- TABELA: role_permissions
-- Mapeamento de permissões por papel
-- =====================================================
CREATE TABLE public.role_permissions (
  role public.user_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Policy: Todos podem ver role_permissions
CREATE POLICY "Everyone can view role permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- FUNCTION: handle_new_user
-- Trigger automático ao criar novo usuário no auth
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que chama a função acima
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCTION: update_updated_at
-- Atualiza automaticamente o campo updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para auto-update de updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- SEED: Permissões Iniciais
-- =====================================================
INSERT INTO public.permissions (name, description) VALUES
  ('events.read', 'Visualizar eventos'),
  ('events.create', 'Criar eventos'),
  ('events.update', 'Atualizar eventos'),
  ('events.delete', 'Deletar eventos'),
  ('events.export', 'Exportar eventos'),
  ('dashboards.view.all', 'Visualizar todos os dashboards'),
  ('dashboards.view.basic', 'Visualizar dashboards básicos'),
  ('dashboards.create', 'Criar dashboards'),
  ('dashboards.share', 'Compartilhar dashboards'),
  ('watchlists.read', 'Visualizar watchlists'),
  ('watchlists.create', 'Criar watchlists'),
  ('watchlists.update', 'Atualizar watchlists'),
  ('watchlists.delete', 'Deletar watchlists'),
  ('config.read', 'Visualizar configurações'),
  ('config.manage', 'Gerenciar configurações'),
  ('config.sources', 'Configurar fontes de dados'),
  ('users.read', 'Visualizar usuários'),
  ('users.invite', 'Convidar usuários'),
  ('users.manage', 'Gerenciar usuários'),
  ('users.remove', 'Remover usuários'),
  ('exports.create', 'Criar exports'),
  ('exports.unlimited', 'Exports ilimitados'),
  ('exports.api', 'Acesso à API de exports'),
  ('analytics.view', 'Visualizar analytics'),
  ('analytics.advanced', 'Analytics avançados'),
  ('audit.view', 'Visualizar logs de auditoria'),
  ('audit.export', 'Exportar logs de auditoria');

-- =====================================================
-- SEED: Mapeamento Role -> Permissions
-- =====================================================

-- ADMIN: Todas as permissões
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions;

-- MANAGER: Permissões de gerenciamento
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'manager', id FROM public.permissions
WHERE name IN (
  'events.read', 'events.create', 'events.update', 'events.delete', 'events.export',
  'dashboards.view.all', 'dashboards.create', 'dashboards.share',
  'watchlists.read', 'watchlists.create', 'watchlists.update', 'watchlists.delete',
  'config.read', 'config.manage',
  'users.read', 'users.invite',
  'exports.create', 'exports.unlimited',
  'analytics.view', 'analytics.advanced'
);

-- EDITOR: Permissões de edição
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'editor', id FROM public.permissions
WHERE name IN (
  'events.read', 'events.create', 'events.update', 'events.export',
  'dashboards.view.all', 'dashboards.create', 'dashboards.share',
  'watchlists.read', 'watchlists.create', 'watchlists.update',
  'config.read',
  'exports.create',
  'analytics.view', 'analytics.advanced'
);

-- MEMBER: Permissões básicas de membro
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'member', id FROM public.permissions
WHERE name IN (
  'events.read', 'events.create',
  'dashboards.view.basic', 'dashboards.create',
  'watchlists.read', 'watchlists.create',
  'config.read',
  'exports.create',
  'analytics.view'
);

-- VIEWER: Apenas visualização
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'viewer', id FROM public.permissions
WHERE name IN (
  'events.read',
  'dashboards.view.basic',
  'watchlists.read',
  'config.read'
);

-- =====================================================
-- COMMENTS
-- Documentação das tabelas
-- =====================================================
COMMENT ON TABLE public.profiles IS 'Perfis de usuários sincronizados com auth.users';
COMMENT ON TABLE public.organizations IS 'Organizações para multi-tenancy';
COMMENT ON TABLE public.organization_members IS 'Membros de organizações com seus papéis';
COMMENT ON TABLE public.permissions IS 'Permissões disponíveis no sistema';
COMMENT ON TABLE public.role_permissions IS 'Mapeamento de permissões por papel';

COMMENT ON COLUMN public.profiles.id IS 'UUID do usuário (FK para auth.users)';
COMMENT ON COLUMN public.organization_members.role IS 'Papel do usuário na organização';
