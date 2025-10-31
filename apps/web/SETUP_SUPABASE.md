# 🚀 Setup do Supabase - AtlasREG

Guia passo a passo para configurar o Supabase no projeto AtlasREG.

---

## ✅ Status

- [x] Credenciais do Supabase configuradas
- [x] Arquivo `.env` criado
- [ ] Migração SQL aplicada ao banco de dados
- [ ] Dependências npm instaladas
- [ ] Aplicação testada

---

## 1️⃣ Aplicar Migração do Banco de Dados

### Opção A: Pelo Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/rmsiufbwcvzuobaxwxvz
   - Faça login com sua conta

2. **Abra o SQL Editor:**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New Query"

3. **Cole o SQL da Migration:**
   ```bash
   # O arquivo está em:
   apps/web/supabase/migrations/20251031000001_initial_schema.sql
   ```
   - Copie TODO o conteúdo do arquivo
   - Cole no editor SQL do Supabase

4. **Execute a Migration:**
   - Clique em "Run" (botão verde no canto inferior direito)
   - Aguarde a execução (deve levar ~5-10 segundos)
   - Verifique se não há erros

5. **Verifique as Tabelas Criadas:**
   - No menu lateral, clique em "Table Editor"
   - Você deve ver 5 tabelas:
     - ✅ `profiles`
     - ✅ `organizations`
     - ✅ `organization_members`
     - ✅ `permissions`
     - ✅ `role_permissions`

### Opção B: Via Supabase CLI (Avançado)

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link com o projeto
supabase link --project-ref rmsiufbwcvzuobaxwxvz

# 4. Aplicar migration
supabase db push
```

---

## 2️⃣ Instalar Dependências

```bash
cd apps/web
npm install
```

Isso instalará:
- `@supabase/supabase-js`
- `@supabase/ssr`
- `@supabase/auth-ui-react`
- `pino` (logging)
- `pino-pretty`
- `zod` (validação)

---

## 3️⃣ Verificar Configuração

### Verificar .env

O arquivo `.env` deve conter:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rmsiufbwcvzuobaxwxvz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
LOG_LEVEL=debug
```

✅ Arquivo já criado!

### Verificar Permissões (Opcional)

Execute este SQL no Supabase para ver as permissões criadas:

```sql
-- Ver todas as permissões
SELECT * FROM public.permissions ORDER BY name;

-- Ver permissões por role
SELECT
  rp.role,
  COUNT(*) as total_permissions
FROM public.role_permissions rp
GROUP BY rp.role
ORDER BY rp.role;
```

Resultado esperado:
- **admin**: 27 permissões (todas)
- **manager**: 19 permissões
- **editor**: 13 permissões
- **member**: 9 permissões
- **viewer**: 4 permissões

---

## 4️⃣ Testar a Aplicação

### Build do TypeScript

```bash
npm run build
```

Se houver erros de tipo, verifique:
- ✅ Todas as importações de Clerk foram removidas
- ✅ Types do Supabase estão corretos em `src/types/database.ts`

### Iniciar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará em: http://localhost:3000

---

## 5️⃣ Criar Primeiro Usuário (Teste)

### Via Interface (Recomendado)

1. Acesse: http://localhost:3000/register
2. Preencha:
   - **Nome**: Seu nome
   - **Email**: seu@email.com
   - **Senha**: mínimo 6 caracteres
3. Clique em "Criar conta"
4. Verifique seu email para confirmar

### Via Supabase Dashboard

1. Vá para "Authentication" > "Users"
2. Clique em "Add user"
3. Escolha "Create new user"
4. Preencha email e senha
5. Marque "Auto Confirm User" (para teste)

### Via SQL (Desenvolvimento)

```sql
-- ATENÇÃO: Use apenas para desenvolvimento/teste
-- Cria usuário e perfil automaticamente

-- 1. Criar usuário no auth (faça pelo Dashboard em Authentication > Users)
-- 2. O trigger handle_new_user() criará o perfil automaticamente

-- 3. Criar uma organização de teste
INSERT INTO public.organizations (name, slug)
VALUES ('Minha Organização', 'minha-org');

-- 4. Adicionar usuário à organização como admin
INSERT INTO public.organization_members (organization_id, user_id, role)
VALUES (
  (SELECT id FROM public.organizations WHERE slug = 'minha-org'),
  'SEU_USER_UUID_AQUI', -- Pegue do Dashboard > Authentication > Users
  'admin'
);
```

---

## 6️⃣ Fluxo de Autenticação

### Páginas Disponíveis

- **Login**: http://localhost:3000/login
- **Registro**: http://localhost:3000/register
- **Recuperar Senha**: http://localhost:3000/forgot-password
- **Dashboard**: http://localhost:3000/dashboard/default (requer auth)

### Redirecionamentos Automáticos

- ✅ Usuário não autenticado → `/login`
- ✅ Usuário autenticado em `/login` → `/dashboard/default`
- ✅ Erro de auth → Error boundary com log

---

## 7️⃣ Estrutura do Banco de Dados

### Tabelas Criadas

```
┌─────────────────────┐
│   auth.users        │  ← Gerenciado pelo Supabase
│   (built-in)        │
└──────────┬──────────┘
           │ (trigger automático)
           ↓
┌─────────────────────┐
│   profiles          │  ← Perfil do usuário
│   - id (FK)         │
│   - email           │
│   - full_name       │
│   - avatar_url      │
└──────────┬──────────┘
           │
           ├─────────────────┐
           ↓                 ↓
┌──────────────────┐  ┌──────────────────┐
│ organizations    │  │ organization_    │
│ - id             │←─│   members        │
│ - name           │  │ - user_id (FK)   │
│ - slug           │  │ - organization_id│
└──────────────────┘  │ - role (enum)    │
                      └──────────────────┘
                               ↓
                      ┌──────────────────┐
                      │ permissions      │
                      │ - id             │
                      │ - name           │
                      └────────┬─────────┘
                               │
                               ↓
                      ┌──────────────────┐
                      │ role_permissions │
                      │ - role (enum)    │
                      │ - permission_id  │
                      └──────────────────┘
```

### Roles Disponíveis

| Role | Permissões | Descrição |
|------|-----------|-----------|
| **admin** | 27 (todas) | Acesso total, gerencia tudo |
| **manager** | 19 | Gerencia recursos e usuários |
| **editor** | 13 | Edita eventos e dashboards |
| **member** | 9 | Cria e visualiza conteúdo básico |
| **viewer** | 4 | Apenas visualização |

### RLS (Row Level Security)

✅ **Ativado em todas as tabelas**

- `profiles`: Usuário vê/edita apenas seu próprio perfil
- `organizations`: Usuário vê apenas orgs que é membro
- `organization_members`: Usuário vê membros das suas orgs
- `permissions`: Todos podem visualizar
- `role_permissions`: Todos podem visualizar

---

## 8️⃣ Troubleshooting

### Erro: "Invalid API key"

```bash
# Verifique se as chaves estão corretas no .env
cat apps/web/.env | grep SUPABASE
```

### Erro: "relation 'profiles' does not exist"

A migration não foi aplicada. Volte ao passo 1️⃣.

### Erro: "User already registered"

Usuário já existe. Use "Esqueci minha senha" ou crie outro email.

### Build falha com erros de tipo

```bash
# Limpe o cache do Next.js
rm -rf apps/web/.next
npm run build
```

### Erro: "Could not find a declaration file for module '@supabase/supabase-js'"

```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

---

## 9️⃣ Verificar Logs

### Logs da Aplicação (Pino)

```bash
# Em desenvolvimento, logs aparecem no terminal
npm run dev

# Exemplo de log:
# {"level":30,"time":1730000000000,"msg":"User logged in","userId":"..."}
```

### Logs do Supabase

1. Acesse o Dashboard
2. Vá para "Logs" > "Database"
3. Filtre por "Functions" ou "Policies"

---

## 🎉 Conclusão

Após completar todos os passos:

- ✅ Banco de dados configurado
- ✅ Usuário de teste criado
- ✅ Aplicação rodando
- ✅ Autenticação funcionando

**Próximo passo**: Comece a usar a aplicação!

- Acesse o dashboard
- Explore as páginas
- Teste as permissões
- Crie organizações

---

## 📚 Documentação Adicional

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Next.js 15**: https://nextjs.org/docs
- **Documentação do Projeto**: Veja `MIGRACAO_COMPLETA.md`

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do terminal
2. Verifique os logs do Supabase Dashboard
3. Consulte `MIGRACAO_COMPLETA.md`
4. Revise este arquivo de setup

**Bom desenvolvimento!** 🚀
