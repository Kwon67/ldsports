#!/bin/bash
IP=$(ip addr show | grep -E 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d/ -f1 | head -1)
echo "=== Verificação de Firewall ==="
echo ""
echo "IP da máquina: $IP"
echo "Porta 3000 (Frontend): $(ss -tuln | grep ':3000' | awk '{print $5}' || echo 'Não ativa')"
echo "Porta 4001 (Backend): $(ss -tuln | grep ':4001' | awk '{print $5}' || echo 'Não ativa')"
echo ""
echo "Status UFW:"
sudo ufw status | head -10
echo ""
echo "Para permitir acesso, execute:"
echo "  sudo ufw allow 3000/tcp"
echo "  sudo ufw allow 4001/tcp"
echo ""
echo "URLs para testar no celular:"
echo "  Frontend: http://$IP:3000"
echo "  Backend:  http://$IP:4001/api/products"
