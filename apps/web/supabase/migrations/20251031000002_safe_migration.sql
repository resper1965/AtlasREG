-- =====================================================
-- MIGRATION SIMPLIFICADA - AtlasREG
-- Teste esta versão primeiro se tiver problemas
-- =====================================================

-- IMPORTANTE: O Supabase já gerencia autenticação!
-- A tabela auth.users é NATIVA e já existe
-- Não precisamos criar sistema de auth do zero
-- Apenas criamos tabelas COMPLEMENTARES

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PASSO 1: CRIAR TABELAS (sem policies)
-- =====================================================

-- TABELA: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- TABELA: organizations
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);

-- ENUM: user_role
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'editor', 'viewer', 'member');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- TABELA: organization_members
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON public.organization_members(role);

-- TABELA: permissions
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- TABELA: role_permissions
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role public.user_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- =====================================================
-- PASSO 2: HABILITAR RLS (Row Level Security)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASSO 3: CRIAR POLICIES (depois das tabelas)
-- =====================================================

-- Policies: profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies: organization_members
DROP POLICY IF EXISTS "Users can view organization members" ON public.organization_members;
CREATE POLICY "Users can view organization members"
  ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can insert organization members" ON public.organization_members;
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

-- Policies: organizations
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
CREATE POLICY "Users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update organizations" ON public.organizations;
CREATE POLICY "Admins can update organizations"
  ON public.organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies: permissions
DROP POLICY IF EXISTS "Everyone can view permissions" ON public.permissions;
CREATE POLICY "Everyone can view permissions"
  ON public.permissions FOR SELECT
  TO authenticated
  USING (true);

-- Policies: role_permissions
DROP POLICY IF EXISTS "Everyone can view role permissions" ON public.role_permissions;
CREATE POLICY "Everyone can view role permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- PASSO 4: TRIGGERS AUTOMÁTICOS
-- =====================================================

-- Função: criar perfil automaticamente quando usuário se registra
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- PASSO 5: SEED DE PERMISSÕES
-- =====================================================

-- Limpar permissões existentes (se re-executar)
DELETE FROM public.role_permissions;
DELETE FROM public.permissions;

-- Inserir permissões
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

-- ADMIN: Todas as permissões
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::public.user_role, id FROM public.permissions;

-- MANAGER: Permissões de gerenciamento
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'manager'::public.user_role, id FROM public.permissions
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
SELECT 'editor'::public.user_role, id FROM public.permissions
WHERE name IN (
  'events.read', 'events.create', 'events.update', 'events.export',
  'dashboards.view.all', 'dashboards.create', 'dashboards.share',
  'watchlists.read', 'watchlists.create', 'watchlists.update',
  'config.read',
  'exports.create',
  'analytics.view', 'analytics.advanced'
);

-- MEMBER: Permissões básicas
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'member'::public.user_role, id FROM public.permissions
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
SELECT 'viewer'::public.user_role, id FROM public.permissions
WHERE name IN (
  'events.read',
  'dashboards.view.basic',
  'watchlists.read',
  'config.read'
);

-- =====================================================
-- DONE! 🎉
-- =====================================================
-- Todas as tabelas criadas com sucesso!
-- Verifique em: Table Editor no Supabase Dashboard
