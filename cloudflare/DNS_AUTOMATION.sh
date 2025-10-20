#!/bin/bash
################################################################################
# ATLASREG - Automação DNS Cloudflare
# Domínio: atlasREG.ness.tec.br
################################################################################

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuração
CF_API_TOKEN="1a3ea7b7e9efa3fda819583eb47080c62c4e1"
DOMAIN="ness.tec.br"

echo "================================================================================"
echo "ATLASREG - Criação Automática de DNS na Cloudflare"
echo "================================================================================"
echo ""

# Verificar se curl está instalado
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl não encontrado. Instale com: sudo apt install curl${NC}"
    exit 1
fi

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq não encontrado. Instale com: sudo apt install jq${NC}"
    echo "Continuando sem jq..."
fi

# Função para fazer requisições à API
cf_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$data" ]; then
        curl -s -X "$method" "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $CF_API_TOKEN" \
            -H "Content-Type: application/json"
    else
        curl -s -X "$method" "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $CF_API_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data"
    fi
}

# 1. Obter Zone ID
echo -e "${YELLOW}1. Obtendo Zone ID do domínio $DOMAIN...${NC}"
ZONE_RESPONSE=$(cf_api "GET" "/zones?name=$DOMAIN")

if command -v jq &> /dev/null; then
    ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id')
    if [ "$ZONE_ID" == "null" ] || [ -z "$ZONE_ID" ]; then
        echo -e "${RED}❌ Erro: Não foi possível obter Zone ID${NC}"
        echo "Resposta da API:"
        echo "$ZONE_RESPONSE" | jq '.'
        exit 1
    fi
else
    # Fallback sem jq
    ZONE_ID=$(echo "$ZONE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

echo -e "${GREEN}✓ Zone ID: $ZONE_ID${NC}"
echo ""

# 2. Criar registros DNS
echo -e "${YELLOW}2. Criando registros DNS...${NC}"
echo ""

# Aguardar input do usuário para IP do VPS
echo -e "${YELLOW}Digite o IP do seu VPS (ou pressione Enter para pular):${NC}"
read -r VPS_IP

# Registro 1: atlasREG (frontend)
echo -e "${YELLOW}Criando: atlasREG.ness.tec.br → atlasreg-frontend.pages.dev${NC}"
RESPONSE=$(cf_api "POST" "/zones/$ZONE_ID/dns_records" '{
  "type": "CNAME",
  "name": "atlasREG",
  "content": "atlasreg-frontend.pages.dev",
  "ttl": 1,
  "proxied": true
}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ atlasREG.ness.tec.br criado${NC}"
else
    echo -e "${RED}❌ Erro ao criar atlasREG.ness.tec.br${NC}"
    echo "$RESPONSE"
fi
echo ""

# Registro 2: api.atlasREG (API Gateway)
echo -e "${YELLOW}Criando: api.atlasREG.ness.tec.br → atlasreg-api-gateway.workers.dev${NC}"
RESPONSE=$(cf_api "POST" "/zones/$ZONE_ID/dns_records" '{
  "type": "CNAME",
  "name": "api.atlasREG",
  "content": "atlasreg-api-gateway.workers.dev",
  "ttl": 1,
  "proxied": true
}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ api.atlasREG.ness.tec.br criado${NC}"
else
    echo -e "${RED}❌ Erro ao criar api.atlasREG.ness.tec.br${NC}"
    echo "$RESPONSE"
fi
echo ""

# Registro 3: trigger.atlasREG (Trigger Ingest)
echo -e "${YELLOW}Criando: trigger.atlasREG.ness.tec.br → atlasreg-trigger-ingest.workers.dev${NC}"
RESPONSE=$(cf_api "POST" "/zones/$ZONE_ID/dns_records" '{
  "type": "CNAME",
  "name": "trigger.atlasREG",
  "content": "atlasreg-trigger-ingest.workers.dev",
  "ttl": 1,
  "proxied": true
}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ trigger.atlasREG.ness.tec.br criado${NC}"
else
    echo -e "${RED}❌ Erro ao criar trigger.atlasREG.ness.tec.br${NC}"
    echo "$RESPONSE"
fi
echo ""

# Registro 4: webhook.atlasREG (Webhook Receiver)
echo -e "${YELLOW}Criando: webhook.atlasREG.ness.tec.br → atlasreg-webhook-receiver.workers.dev${NC}"
RESPONSE=$(cf_api "POST" "/zones/$ZONE_ID/dns_records" '{
  "type": "CNAME",
  "name": "webhook.atlasREG",
  "content": "atlasreg-webhook-receiver.workers.dev",
  "ttl": 1,
  "proxied": true
}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ webhook.atlasREG.ness.tec.br criado${NC}"
else
    echo -e "${RED}❌ Erro ao criar webhook.atlasREG.ness.tec.br${NC}"
    echo "$RESPONSE"
fi
echo ""

# Registro 5: vps.atlasREG (se IP foi fornecido)
if [ -n "$VPS_IP" ]; then
    echo -e "${YELLOW}Criando: vps.atlasREG.ness.tec.br → $VPS_IP${NC}"
    RESPONSE=$(cf_api "POST" "/zones/$ZONE_ID/dns_records" "{
      \"type\": \"A\",
      \"name\": \"vps.atlasREG\",
      \"content\": \"$VPS_IP\",
      \"ttl\": 1,
      \"proxied\": false
    }")

    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✓ vps.atlasREG.ness.tec.br → $VPS_IP criado${NC}"
    else
        echo -e "${RED}❌ Erro ao criar vps.atlasREG.ness.tec.br${NC}"
        echo "$RESPONSE"
    fi
else
    echo -e "${YELLOW}⚠️  VPS IP não fornecido. Pulando criação de vps.atlasREG.ness.tec.br${NC}"
    echo "   Você pode criar manualmente depois no Dashboard da Cloudflare"
fi
echo ""

# 3. Listar registros criados
echo "================================================================================"
echo -e "${GREEN}✓ DNS criados com sucesso!${NC}"
echo "================================================================================"
echo ""
echo "URLs disponíveis:"
echo "  Frontend:  https://atlasREG.ness.tec.br"
echo "  API:       https://api.atlasREG.ness.tec.br"
echo "  Trigger:   https://trigger.atlasREG.ness.tec.br"
echo "  Webhook:   https://webhook.atlasREG.ness.tec.br"
if [ -n "$VPS_IP" ]; then
    echo "  VPS:       https://vps.atlasREG.ness.tec.br ($VPS_IP)"
fi
echo ""
echo "Aguarde 5-30 minutos para propagação DNS."
echo ""
echo "Próximos passos:"
echo "1. Configurar Workers com domínio customizado"
echo "2. Deploy Workers"
echo "3. Atualizar .env do Orchestrator"
echo "4. Testar endpoints"
echo ""
echo "================================================================================"

