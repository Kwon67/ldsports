#!/bin/bash

echo "=== LDsports - Iniciando Ambiente de Desenvolvimento ==="
echo ""

# Obter IP da máquina
IP=$(ip addr show | grep -E 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d/ -f1 | head -1)

echo "📍 URLs de Acesso:"
echo "   Notebook:  http://localhost:3000"
echo "   Celular:   http://$IP:3000"
echo ""

# Verificar se o backend está rodando
if ! pgrep -f "node.*backend/src/server.js" > /dev/null; then
    echo "⚠️  Backend não está rodando!"
    echo "   Execute em outro terminal: cd backend && npm start"
    echo ""
fi

# Verificar configuração do .env.local
if grep -q "^NEXT_PUBLIC_API_URL=http://localhost" frontend-next/.env.local 2>/dev/null; then
    echo "⚠️  ATENÇÃO: NEXT_PUBLIC_API_URL está fixo em localhost"
    echo "   Isso vai quebrar no celular. Comente essa linha no .env.local"
    echo ""
fi

echo "🚀 Iniciando Frontend..."
echo ""
cd frontend-next && npm run dev
