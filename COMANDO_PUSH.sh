#!/bin/bash
################################################################################
# ATLASREG - Push para GitHub
# Execute após criar repositório no GitHub
################################################################################

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║              ATLASREG - PUSH PARA GITHUB                                     ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

cd /home/resper/nSaulo

# Verificar se remote já existe
if git remote get-url origin &> /dev/null; then
    echo -e "${GREEN}✓ Remote 'origin' já configurado:${NC}"
    git remote get-url origin
    echo ""
    echo -e "${YELLOW}Fazendo push...${NC}"
else
    echo -e "${YELLOW}Configure o remote do GitHub:${NC}"
    echo "Digite a URL do repositório:"
    echo "Exemplo: https://github.com/SEU_USER/atlasreg.git"
    echo ""
    read -p "URL: " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo "URL não fornecida. Abortando."
        exit 1
    fi
    
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✓ Remote adicionado${NC}"
    echo ""
fi

# Garantir que está na branch main
git branch -M main

# Push
echo -e "${YELLOW}Pushing para origin/main...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════════════════════"
    echo -e "${GREEN}✓ PUSH CONCLUÍDO COM SUCESSO!${NC}"
    echo "════════════════════════════════════════════════════════════════════════════════"
    echo ""
    echo "Repositório disponível em:"
    git remote get-url origin
    echo ""
    echo "Próximos passos:"
    echo "  1. Deploy Cloudflare: ./DEPLOY_AUTOMATICO.sh"
    echo "  2. Configurar DNS"
    echo "  3. Atualizar .env Orchestrator"
    echo ""
else
    echo ""
    echo "❌ Erro no push. Verifique:"
    echo "  - Se o repositório foi criado no GitHub"
    echo "  - Se a URL está correta"
    echo "  - Se tem permissão de push"
fi
