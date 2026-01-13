# Solução: Produtos Não Estão Carregando Após Deploy

## Diagnóstico do Problema

Após análise, identifiquei que o problema ocorre porque **o frontend na Vercel não consegue se conectar ao backend**.

### Causas Identificadas:

1. **Variável de ambiente não configurada na Vercel**
   - O frontend precisa da variável `NEXT_PUBLIC_API_URL` configurada na Vercel
   - Atualmente, o `.env.local` aponta para `http://localhost:4001/api` (que só funciona localmente)

2. **Backend pode não estar acessível**
   - O backend precisa estar deployado e rodando na Vercel
   - A URL do backend em produção precisa estar acessível publicamente

3. **MongoDB pode estar vazio**
   - O banco de dados MongoDB pode não ter produtos cadastrados

---

## Soluções

### Solução 1: Configurar Variável de Ambiente na Vercel (Frontend)

#### Passo 1: Descobrir a URL do Backend em Produção

1. Acesse https://vercel.com/dashboard
2. Encontre o projeto do **backend** (ldsports-backend ou similar)
3. Copie a URL de produção (ex: `https://ldsports-backend.vercel.app`)

#### Passo 2: Configurar Variável no Frontend

1. No dashboard da Vercel, acesse o projeto do **frontend**
2. Vá em **Settings → Environment Variables**
3. Adicione a variável:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://sua-url-do-backend.vercel.app/api`
   - ⚠️ Substitua pela URL real do seu backend!
4. Marque para **Production, Preview e Development**
5. Clique em **Save**

#### Passo 3: Redeploy do Frontend

Após salvar a variável, faça um redeploy:
- Na página do projeto, clique em **Deployments**
- No último deployment, clique no menu **...** e selecione **Redeploy**

---

### Solução 2: Popular o MongoDB com Produtos

Se o banco de dados estiver vazio, você precisa executar o script de seed:

```bash
cd backend
node src/scripts/seed.js
```

Este script irá:
- Conectar ao MongoDB
- Limpar produtos existentes
- Inserir todos os produtos do arquivo `db.json`

---

### Solução 3: Verificar se o Backend Está Rodando

#### Teste 1: Verificar se o backend responde

Abra o navegador e acesse:
```
https://sua-url-do-backend.vercel.app
```

Você deve ver: `LDsports API online`

#### Teste 2: Verificar rota de produtos

Acesse:
```
https://sua-url-do-backend.vercel.app/api/products
```

Você deve ver um JSON com a lista de produtos.

Se não funcionar, verifique:
1. O backend foi deployado corretamente na Vercel?
2. As variáveis de ambiente do backend estão configuradas na Vercel?
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## Configuração Completa das Variáveis de Ambiente

### Backend (Vercel)

Acesse: **Settings → Environment Variables** do projeto backend

```
MONGODB_URI=mongodb+srv://ldsport-admin:%40qualcomm845@cluster0.srogyxy.mongodb.net/ldsports?appName=Cluster0

CLOUDINARY_CLOUD_NAME=diuh0ditl
CLOUDINARY_API_KEY=253854183362134
CLOUDINARY_API_SECRET=oTHmlEJU5f7UROyHQVBoyqwt_8g

NODE_ENV=production
```

### Frontend (Vercel)

Acesse: **Settings → Environment Variables** do projeto frontend

```
NEXT_PUBLIC_API_URL=https://sua-url-do-backend.vercel.app/api

NEXTAUTH_URL=https://seu-dominio-frontend.vercel.app
NEXTAUTH_SECRET=M+7DxL3/KGesceuVSZPWN5v4eTLPn+zBIJloK2l0uvA=

GOOGLE_CLIENT_ID=1033982553846-mdiurs6pacioul7icp753k4ld8vtcv14.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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U
```

⚠️ **IMPORTANTE:** Substitua as URLs pelos domínios reais dos seus projetos na Vercel!

---

## Checklist de Verificação

- [ ] Backend está deployado na Vercel e acessível
- [ ] Variáveis de ambiente do backend configuradas na Vercel
- [ ] MongoDB tem produtos (rodar seed se necessário)
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada no frontend apontando para o backend em produção
- [ ] Redeploy do frontend feito após configurar variáveis
- [ ] Testar acessar `https://backend-url/api/products` no navegador
- [ ] Testar o site em produção

---

## Como Testar se Funcionou

1. **Teste o backend diretamente:**
   ```
   https://sua-url-backend.vercel.app/api/products
   ```
   Deve retornar um JSON com produtos

2. **Acesse seu site em produção:**
   ```
   https://seu-dominio-frontend.vercel.app
   ```
   Os produtos devem aparecer na página principal

3. **Verifique o console do navegador:**
   - Abra DevTools (F12)
   - Vá na aba Console
   - Não deve haver erros de CORS ou Network
   - Não deve haver erros 404 ou 500

---

## Problemas Comuns

### Erro: CORS Policy

Se aparecer erro de CORS, verifique se:
- O backend está configurado para aceitar requests do domínio do frontend
- No `server.js` do backend, a configuração CORS está permitindo todas as origens

### Erro: Network Error ou Timeout

Se aparecer erro de rede:
- Verifique se a URL do backend está correta
- Teste a URL do backend diretamente no navegador
- Verifique se o backend está online na Vercel

### Produtos Ainda Não Aparecem

Se ainda não funcionar:
1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se o redeploy foi concluído com sucesso
3. Abra o console do navegador para ver erros específicos
4. Verifique os logs na Vercel (Functions → Logs)

---

## Próximos Passos

Depois de resolver o problema:

1. ✅ Configure os URIs no Google Cloud Console (já documentado em VERCEL_ENV_VARIABLES.md)
2. ✅ Teste o login com Google em produção
3. ✅ Teste todas as funcionalidades do site (carrinho, favoritos, checkout)

Se precisar de ajuda adicional, me avise com detalhes do erro específico que está aparecendo!
