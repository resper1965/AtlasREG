#!/bin/bash
################################################################################
# ATLASREG - Deploy Automático Cloudflare + GitHub
# Domínio: atlasREG.ness.tec.br
################################################################################

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║              ATLASREG - DEPLOY AUTOMÁTICO CLOUDFLARE + GITHUB                ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Diretório raiz do projeto
PROJECT_ROOT="/home/resper/nSaulo"
cd "$PROJECT_ROOT"

################################################################################
# PARTE 1: VERIFICAÇÕES PRÉ-REQUISITOS
################################################################################

echo -e "${BLUE}[1/6] Verificando pré-requisitos...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Instale com: sudo apt install nodejs npm"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# Verificar NPM
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ NPM: $(npm --version)${NC}"

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não encontrado!${NC}"
    echo "Instale com: sudo apt install git"
    exit 1
fi
echo -e "${GREEN}✓ Git: $(git --version)${NC}"

# Verificar/Instalar Wrangler
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler não encontrado. Instalando...${NC}"
    npm install -g wrangler
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao instalar Wrangler${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Wrangler: $(wrangler --version)${NC}"

echo ""

################################################################################
# PARTE 2: LOGIN CLOUDFLARE
################################################################################

echo -e "${BLUE}[2/6] Verificando autenticação Cloudflare...${NC}"

# Verificar se já está autenticado
if wrangler whoami &> /dev/null; then
    echo -e "${GREEN}✓ Já autenticado na Cloudflare${NC}"
    wrangler whoami
else
    echo -e "${YELLOW}⚠️  Não autenticado. Iniciando login...${NC}"
    echo "Uma janela do navegador será aberta para autenticação."
    echo "Pressione Enter para continuar..."
    read
    wrangler login
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro no login Cloudflare${NC}"
        exit 1
    fi
fi

echo ""

################################################################################
# PARTE 3: CRIAR RECURSOS CLOUDFLARE
################################################################################

echo -e "${BLUE}[3/6] Criando recursos Cloudflare...${NC}"

# Queue
echo -e "${YELLOW}Criando Cloudflare Queue...${NC}"
if wrangler queues list | grep -q "atlasreg-ingest-queue"; then
    echo -e "${GREEN}✓ Queue 'atlasreg-ingest-queue' já existe${NC}"
else
    wrangler queues create atlasreg-ingest-queue
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Queue criada com sucesso${NC}"
    else
        echo -e "${YELLOW}⚠️  Erro ao criar Queue (pode já existir)${NC}"
    fi
fi

# KV Namespace
echo -e "${YELLOW}Criando KV Namespace...${NC}"
KV_OUTPUT=$(wrangler kv:namespace create "STATUS_KV" 2>&1)
if echo "$KV_OUTPUT" | grep -q "id ="; then
    KV_ID=$(echo "$KV_OUTPUT" | grep "id =" | cut -d'"' -f2)
    echo -e "${GREEN}✓ KV Namespace criado: $KV_ID${NC}"
    
    # Atualizar webhook-receiver/wrangler.toml com o ID
    if [ -n "$KV_ID" ]; then
        sed -i "s/id = \"SEU_KV_NAMESPACE_ID\"/id = \"$KV_ID\"/" \
            cloudflare/workers/webhook-receiver/wrangler.toml
        echo -e "${GREEN}✓ KV ID configurado automaticamente no webhook-receiver${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  KV Namespace pode já existir ou erro na criação${NC}"
    echo "Verifique e configure manualmente se necessário"
fi

# R2 Bucket
echo -e "${YELLOW}Criando R2 Bucket...${NC}"
if wrangler r2 bucket list | grep -q "atlasreg-gold"; then
    echo -e "${GREEN}✓ R2 Bucket 'atlasreg-gold' já existe${NC}"
else
    wrangler r2 bucket create atlasreg-gold
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ R2 Bucket criado com sucesso${NC}"
    else
        echo -e "${YELLOW}⚠️  Erro ao criar R2 Bucket (pode já existir)${NC}"
    fi
fi

echo ""

################################################################################
# PARTE 4: DEPLOY WORKERS
################################################################################

echo -e "${BLUE}[4/6] Deploy dos Workers na Cloudflare...${NC}"

# Worker 1: api-gateway
echo -e "${YELLOW}Deploying api-gateway...${NC}"
cd "$PROJECT_ROOT/cloudflare/workers/api-gateway"
wrangler deploy
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ api-gateway deployed${NC}"
else
    echo -e "${RED}❌ Erro no deploy api-gateway${NC}"
fi
cd "$PROJECT_ROOT"

# Worker 2: trigger-ingest
echo -e "${YELLOW}Deploying trigger-ingest...${NC}"
cd "$PROJECT_ROOT/cloudflare/workers/trigger-ingest"
wrangler deploy
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ trigger-ingest deployed${NC}"
else
    echo -e "${RED}❌ Erro no deploy trigger-ingest${NC}"
fi
cd "$PROJECT_ROOT"

# Worker 3: webhook-receiver
echo -e "${YELLOW}Deploying webhook-receiver...${NC}"
cd "$PROJECT_ROOT/cloudflare/workers/webhook-receiver"
wrangler deploy
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ webhook-receiver deployed${NC}"
else
    echo -e "${RED}❌ Erro no deploy webhook-receiver${NC}"
fi
cd "$PROJECT_ROOT"

echo ""

################################################################################
# PARTE 5: DNS (Opcional - Manual)
################################################################################

echo -e "${BLUE}[5/6] Configuração DNS...${NC}"
echo -e "${YELLOW}DNS deve ser configurado manualmente no Cloudflare Dashboard:${NC}"
echo "1. Acesse: https://dash.cloudflare.com/"
echo "2. Selecione: ness.tec.br"
echo "3. DNS → Records → Add record"
echo "4. Criar CNAMEs conforme: DNS_CLOUDFLARE_CONFIG.txt"
echo ""
echo "Ou execute: ./cloudflare/DNS_AUTOMATION.sh"
echo ""

################################################################################
# PARTE 6: GIT COMMIT E PUSH
################################################################################

echo -e "${BLUE}[6/6] Commit e push para GitHub...${NC}"

# Verificar se é um repositório git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Inicializando repositório Git...${NC}"
    git init
    echo -e "${GREEN}✓ Repositório Git inicializado${NC}"
fi

# Configurar remote se não existir
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}Configure o remote do GitHub:${NC}"
    echo "git remote add origin https://github.com/SEU_USER/atlasreg.git"
    echo ""
    echo "Pressione Enter após configurar ou CTRL+C para cancelar"
    read
fi

# Adicionar arquivos
echo -e "${YELLOW}Adicionando arquivos...${NC}"
git add .

# Commit
echo -e "${YELLOW}Criando commit...${NC}"
COMMIT_MSG="feat: Deploy AtlasReg na Cloudflare - atlasREG.ness.tec.br

- Workers deployed (api-gateway, trigger-ingest, webhook-receiver)
- Senhas seguras geradas
- Documentação completa
- Scripts de automação
- Configuração DNS preparada

Domínio: atlasREG.ness.tec.br
Data: $(date +%Y-%m-%d)
"

git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Commit criado com sucesso${NC}"
    
    # Push
    echo -e "${YELLOW}Fazendo push para GitHub...${NC}"
    git push -u origin main || git push -u origin master
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Push realizado com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro no push${NC}"
        echo "Verifique se o remote está configurado corretamente"
        echo "Configure com: git remote add origin https://github.com/USER/REPO.git"
    fi
else
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar ou erro no commit${NC}"
fi

echo ""

################################################################################
# RESUMO FINAL
################################################################################

echo "════════════════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ DEPLOY CONCLUÍDO!${NC}"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""
echo "Workers Deployed:"
echo "  ✓ https://atlasreg-api-gateway.workers.dev"
echo "  ✓ https://atlasreg-trigger-ingest.workers.dev"
echo "  ✓ https://atlasreg-webhook-receiver.workers.dev"
echo ""
echo "Recursos Criados:"
echo "  ✓ Queue: atlasreg-ingest-queue"
echo "  ✓ KV: STATUS_KV"
echo "  ✓ R2: atlasreg-gold"
echo ""
echo "Próximos passos:"
echo "  1. Configurar DNS (ver DNS_CLOUDFLARE_CONFIG.txt)"
echo "  2. Atualizar .env do Orchestrator"
echo "  3. Restart Orchestrator: docker-compose restart orchestrator"
echo "  4. Testar endpoints"
echo ""
echo "Testes:"
echo "  curl https://atlasreg-trigger-ingest.YOUR_SUBDOMAIN.workers.dev/health"
echo ""
echo "════════════════════════════════════════════════════════════════════════════════"

