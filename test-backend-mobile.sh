#!/bin/bash
IP=$(ip addr show | grep -E 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d/ -f1 | head -1)
echo "=== Teste de Backend para Mobile ==="
echo ""
echo "IP da máquina: $IP"
echo ""
echo "Testando backend localmente:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4001/api/products
echo ""
echo "Testando backend pela rede:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://$IP:4001/api/products
echo ""
echo "Testando CORS:"
curl -s -H "Origin: http://$IP:3000" -H "Access-Control-Request-Method: GET" -X OPTIONS http://$IP:4001/api/products -o /dev/null -w "Status: %{http_code}\n"
echo ""
echo "URLs para testar no mobile:"
echo "  Frontend: http://$IP:3000"
echo "  Backend:  http://$IP:4001/api/products"
echo ""
echo "Se o backend não responder pela rede, execute:"
echo "  sudo ufw allow 4001/tcp"
