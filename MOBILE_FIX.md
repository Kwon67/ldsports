# Como Usar o App no Notebook e Celular

## Solução Implementada

O problema era que o `.env.local` tinha a URL da API fixa como `localhost`, o que não funciona no celular.

### O que foi corrigido:

1. **Comentada a variável `NEXT_PUBLIC_API_URL` no `.env.local`**
   - Isso permite que o código detecte automaticamente o IP correto
   - No notebook: usa `http://localhost:4001/api`
   - No celular: usa `http://SEU_IP:4001/api` (ex: `http://192.168.3.70:4001/api`)

2. **A função `getApiUrl()` já estava preparada para isso:**
   ```typescript
   // Detecta automaticamente:
   // - localhost no notebook
   // - IP da rede no celular
   ```

## Como Usar

### Opção 1: Script Automático (Recomendado)

```bash
# Na raiz do projeto
./start-dev.sh
```

### Opção 2: Manual

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend-next
npm run dev
```

## URLs de Acesso

### No Notebook:
- Frontend: http://localhost:3000
- Backend: http://localhost:4001/api/products

### No Celular:
- Primeiro, descubra o IP da sua máquina:
  ```bash
  ip addr show | grep -E 'inet ' | grep -v '127.0.0.1'
  ```

- Depois acesse (exemplo com IP 192.168.3.70):
  - Frontend: http://192.168.3.70:3000
  - Backend: http://192.168.3.70:4001/api/products

## Verificação

Se os produtos não carregarem no celular:

1. **Verifique o console do navegador no celular** (use Remote Debugging)
2. **Teste a URL da API diretamente no navegador do celular:**
   - http://SEU_IP:4001/api/products
   - Deve retornar um JSON com os produtos

3. **Execute o diagnóstico:**
   ```bash
   ./test-backend-mobile.sh
   ```

## Firewall

Se necessário, libere as portas:
```bash
sudo ufw allow 3000/tcp comment 'LDsports Frontend'
sudo ufw allow 4001/tcp comment 'LDsports Backend'
sudo ufw reload
```

## IMPORTANTE

⚠️ **NUNCA descomente a linha `NEXT_PUBLIC_API_URL` no `.env.local`**
   - Isso quebraria o acesso pelo celular
   - A detecção automática funciona melhor

⚠️ **Certifique-se de que o notebook e celular estão na MESMA REDE WiFi**
