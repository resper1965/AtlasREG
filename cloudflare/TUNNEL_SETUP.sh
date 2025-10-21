#!/bin/bash
################################################################################
# ATLASREG - Setup Cloudflare Tunnel
# Expõe Frontend Docker na Cloudflare Edge
################################################################################

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║              ATLASREG - CLOUDFLARE TUNNEL SETUP                              ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

################################################################################
# VERIFICAÇÕES
################################################################################

echo -e "${BLUE}[1/6] Verificando pré-requisitos...${NC}"

# Verificar se frontend está rodando
if ! docker ps | grep -q atlasreg-web; then
    echo -e "${YELLOW}⚠️  Frontend não está rodando. Iniciando...${NC}"
    cd /home/resper/nSaulo
    docker-compose up -d web
    sleep 5
fi

# Testar frontend local
if curl -s http://localhost:3100 > /dev/null; then
    echo -e "${GREEN}✓ Frontend rodando em http://localhost:3100${NC}"
else
    echo -e "${RED}❌ Frontend não responde em localhost:3100${NC}"
    exit 1
fi

# Verificar cloudflared
if ! command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}⚠️  cloudflared não instalado. Instalando...${NC}"
    
    # Download
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -O /tmp/cloudflared.deb
    
    # Instalar
    sudo dpkg -i /tmp/cloudflared.deb 2>&1 | grep -v "dpkg-deb"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ cloudflared instalado${NC}"
    else
        echo -e "${RED}❌ Erro ao instalar cloudflared${NC}"
        echo "Instale manualmente: sudo dpkg -i /tmp/cloudflared.deb"
        exit 1
    fi
else
    echo -e "${GREEN}✓ cloudflared: $(cloudflared --version | head -1)${NC}"
fi

echo ""

################################################################################
# AUTENTICAÇÃO
################################################################################

echo -e "${BLUE}[2/6] Autenticação Cloudflare...${NC}"

if [ -f "$HOME/.cloudflared/cert.pem" ]; then
    echo -e "${GREEN}✓ Já autenticado${NC}"
else
    echo -e "${YELLOW}Iniciando autenticação...${NC}"
    echo "Uma janela do navegador será aberta."
    echo "Faça login na Cloudflare e autorize o tunnel."
    echo ""
    
    cloudflared tunnel login
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Autenticação concluída${NC}"
    else
        echo -e "${RED}❌ Erro na autenticação${NC}"
        exit 1
    fi
fi

echo ""

################################################################################
# CRIAR TUNNEL
################################################################################

echo -e "${BLUE}[3/6] Criando Cloudflare Tunnel...${NC}"

# Verificar se tunnel já existe
if cloudflared tunnel list | grep -q "atlasreg-frontend"; then
    echo -e "${GREEN}✓ Tunnel 'atlasreg-frontend' já existe${NC}"
    TUNNEL_ID=$(cloudflared tunnel list | grep "atlasreg-frontend" | awk '{print $1}')
else
    echo -e "${YELLOW}Criando tunnel...${NC}"
    cloudflared tunnel create atlasreg-frontend
    
    if [ $? -eq 0 ]; then
        TUNNEL_ID=$(cloudflared tunnel list | grep "atlasreg-frontend" | awk '{print $1}')
        echo -e "${GREEN}✓ Tunnel criado: $TUNNEL_ID${NC}"
    else
        echo -e "${RED}❌ Erro ao criar tunnel${NC}"
        exit 1
    fi
fi

echo ""

################################################################################
# CONFIGURAR TUNNEL
################################################################################

echo -e "${BLUE}[4/6] Configurando tunnel...${NC}"

# Criar diretório config
mkdir -p ~/.cloudflared

# Criar arquivo de configuração
cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: atlasREG.ness.tec.br
    service: http://localhost:3100
  - hostname: web.atlasREG.ness.tec.br
    service: http://localhost:3100
  - service: http_status:404
EOF

echo -e "${GREEN}✓ Configuração criada em ~/.cloudflared/config.yml${NC}"

echo ""

################################################################################
# CRIAR DNS
################################################################################

echo -e "${BLUE}[5/6] Configurando DNS...${NC}"

echo -e "${YELLOW}Criando DNS para atlasREG.ness.tec.br...${NC}"
cloudflared tunnel route dns $TUNNEL_ID atlasREG.ness.tec.br

echo -e "${YELLOW}Criando DNS para web.atlasREG.ness.tec.br...${NC}"
cloudflared tunnel route dns $TUNNEL_ID web.atlasREG.ness.tec.br

echo -e "${GREEN}✓ DNS configurado automaticamente${NC}"

echo ""

################################################################################
# RODAR TUNNEL
################################################################################

echo -e "${BLUE}[6/6] Iniciando tunnel...${NC}"

echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ TUNNEL CONFIGURADO COM SUCESSO!${NC}"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""
echo "Frontend disponível em:"
echo "  https://atlasREG.ness.tec.br"
echo "  https://web.atlasREG.ness.tec.br"
echo ""
echo "Para rodar o tunnel:"
echo "  cloudflared tunnel run atlasreg-frontend"
echo ""
echo "Ou em background:"
echo "  cloudflared tunnel run atlasreg-frontend &"
echo ""
echo "Ou como serviço (permanente):"
echo "  sudo cloudflared service install"
echo "  sudo systemctl start cloudflared"
echo ""
echo "Logs:"
echo "  cloudflared tunnel info atlasreg-frontend"
echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}Deseja iniciar o tunnel agora? (y/n)${NC}"
read -r ANSWER

if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "Y" ]; then
    echo ""
    echo -e "${GREEN}Iniciando tunnel...${NC}"
    echo "Pressione Ctrl+C para parar"
    echo ""
    cloudflared tunnel run atlasreg-frontend
else
    echo ""
    echo "Tunnel configurado mas não iniciado."
    echo "Para iniciar: cloudflared tunnel run atlasreg-frontend"
fi

