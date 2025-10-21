#!/bin/bash
################################################################################
# ATLASREG - Deploy Frontend no Cloudflare Pages
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
echo "║              ATLASREG - DEPLOY FRONTEND CLOUDFLARE PAGES                     ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_ROOT="/home/resper/nSaulo"
FRONTEND_DIR="$PROJECT_ROOT/apps/web"

################################################################################
# VERIFICAÇÕES
################################################################################

echo -e "${BLUE}[1/4] Verificando pré-requisitos...${NC}"

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# NPM
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ NPM: $(npm --version)${NC}"

# Wrangler
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler não encontrado. Instalando...${NC}"
    npm install -g wrangler
fi
echo -e "${GREEN}✓ Wrangler: $(wrangler --version)${NC}"

# Frontend existe
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Frontend não encontrado em $FRONTEND_DIR${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend: $FRONTEND_DIR${NC}"

echo ""

################################################################################
# AUTENTICAÇÃO
################################################################################

echo -e "${BLUE}[2/4] Verificando autenticação Cloudflare...${NC}"

if wrangler whoami &> /dev/null; then
    echo -e "${GREEN}✓ Autenticado${NC}"
    wrangler whoami
else
    echo -e "${YELLOW}⚠️  Não autenticado. Iniciando login...${NC}"
    wrangler login
fi

echo ""

################################################################################
# BUILD
################################################################################

echo -e "${BLUE}[3/4] Building frontend Next.js...${NC}"

cd "$FRONTEND_DIR"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências...${NC}"
    npm install
fi

# Build
echo -e "${YELLOW}Building...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build concluído${NC}"
else
    echo -e "${RED}❌ Erro no build${NC}"
    exit 1
fi

echo ""

################################################################################
# DEPLOY
################################################################################

echo -e "${BLUE}[4/4] Deploy no Cloudflare Pages...${NC}"

echo -e "${YELLOW}Fazendo deploy...${NC}"

npx wrangler pages deploy .next --project-name=atlasreg-frontend

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════════════════════"
    echo -e "${GREEN}✓ DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
    echo "════════════════════════════════════════════════════════════════════════════════"
    echo ""
    echo "Frontend disponível em:"
    echo "  Temporário: https://atlasreg-frontend.pages.dev"
    echo ""
    echo "Próximos passos:"
    echo "  1. Configurar domínio customizado:"
    echo "     Dashboard → Pages → atlasreg-frontend → Custom domains"
    echo "     Adicionar: atlasREG.ness.tec.br"
    echo ""
    echo "  2. Testar:"
    echo "     curl -I https://atlasreg-frontend.pages.dev"
    echo ""
    echo "  3. Após configurar domínio:"
    echo "     https://atlasREG.ness.tec.br"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Erro no deploy${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  - Verificar se está autenticado: wrangler whoami"
    echo "  - Verificar build output: ls -la .next/"
    echo "  - Tentar novamente: ./DEPLOY_PAGES.sh"
    exit 1
fi

cd "$PROJECT_ROOT"

