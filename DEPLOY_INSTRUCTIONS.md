# 🚀 Instruções de Deploy - LDSports

## Problema Atual
O erro 404 no upload de imagens acontece porque:
1. As rotas de admin não estão funcionando no backend em produção
2. A variável `NEXT_PUBLIC_API_URL` pode não estar configurada corretamente

## ✅ Solução Completa

### Passo 1: Fazer Redeploy do Backend

1. Acesse: https://vercel.com/dashboard
2. Encontre o projeto: **backend**
3. Vá em **Deployments**
4. Clique nos **3 pontinhos** do último deployment
5. Clique em **Redeploy**
6. Marque: ☑️ Use existing Build Cache
7. Clique em **Redeploy**
8. **Aguarde 2-3 minutos** até o deploy terminar

### Passo 2: Testar se o Backend Está Funcionando

Abra no navegador:
```
https://backend-chi-six-83.vercel.app/api/admin/login
```

Deve aparecer algo como:
```json
Cannot POST /api/admin/login
```

Isso é normal (porque não enviamos dados). O importante é **NÃO aparecer 404**.

### Passo 3: Configurar Variável de Ambiente no Frontend

1. Acesse: https://vercel.com/dashboard
2. Encontre o projeto: **ldsports** (frontend)
3. Vá em: **Settings** → **Environment Variables**
4. Procure por: `NEXT_PUBLIC_API_URL`

**Se NÃO EXISTIR:**
- Clique em **Add New**
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://backend-chi-six-83.vercel.app/api`
- **Environments**: Marque ☑️ **Production**, ☑️ **Preview**, ☑️ **Development**
- Clique em **Save**

**Se JÁ EXISTIR:**
- Verifique se o valor é: `https://backend-chi-six-83.vercel.app/api`
- Se estiver diferente, clique em **Edit** e corrija
- Certifique-se que está marcado para **Production**

### Passo 4: Redeploy do Frontend

1. Ainda no projeto **ldsports**
2. Vá em **Deployments**
3. Clique nos **3 pontinhos** do último deployment
4. Clique em **Redeploy**
5. Marque: ☑️ Use existing Build Cache
6. Clique em **Redeploy**
7. **Aguarde 2-3 minutos**

### Passo 5: Testar o Upload

1. Acesse: https://ldsports.vercel.app/admin
2. Faça login com:
   - Usuário: `kwon`
   - Senha: `251636`
3. Vá em **Configurações** (ícone de engrenagem)
4. Tente fazer upload de uma imagem
5. Se der erro, abra o **Console do Navegador** (F12) e veja os logs

## 🔍 Como Verificar se Está Funcionando

### Backend Funcionando:
```bash
curl https://backend-chi-six-83.vercel.app
# Deve retornar: "LDsports API online"
```

### Variável Configurada:
No console do navegador em ldsports.vercel.app, você deve ver:
```
[API Config] Using NEXT_PUBLIC_API_URL: https://backend-chi-six-83.vercel.app/api
```

## ❌ Se Ainda Não Funcionar

### Opção 1: Verificar Logs do Backend
1. Vá no projeto backend no Vercel
2. Clique em **Deployments**
3. Clique no último deployment
4. Vá em **Logs** e procure por erros

### Opção 2: Verificar no Console
Abra o Console do Navegador (F12) em ldsports.vercel.app/admin e veja:
- Qual URL está sendo usada
- Qual erro está acontecendo
- Se é 404, 500, ou outro erro

### Opção 3: Me Envie os Logs
Me envie:
1. Os logs do console do navegador
2. A URL que aparece nos logs
3. O código de erro (404, 500, etc)

## 📝 Resumo Rápido

```bash
# 1. Redeploy do backend no Vercel
# 2. Configure NEXT_PUBLIC_API_URL = https://backend-chi-six-83.vercel.app/api
# 3. Redeploy do frontend no Vercel
# 4. Teste o upload
```

## 🎯 URLs Importantes

- **Backend**: https://backend-chi-six-83.vercel.app
- **Frontend**: https://ldsports.vercel.app
- **Painel Admin**: https://ldsports.vercel.app/admin
- **Vercel Dashboard**: https://vercel.com/dashboard
