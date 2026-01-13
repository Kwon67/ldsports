# Configuração do Login com Google

Este guia explica como configurar a autenticação via Google OAuth no LDsports.

## Passo 1: Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **"Select a project"** no topo da página
3. Clique em **"NEW PROJECT"**
4. Dê um nome ao projeto (ex: "LDsports")
5. Clique em **"CREATE"**

## Passo 2: Configurar a Tela de Consentimento OAuth

1. No menu lateral, vá em **"APIs & Services"** > **"OAuth consent screen"**
2. Selecione **"External"** (para permitir qualquer conta Google)
3. Clique em **"CREATE"**
4. Preencha as informações obrigatórias:
   - **App name**: LDsports
   - **User support email**: seu email
   - **Developer contact information**: seu email
5. Clique em **"SAVE AND CONTINUE"**
6. Em **"Scopes"**, clique em **"ADD OR REMOVE SCOPES"**
7. Selecione os escopos:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Clique em **"UPDATE"** e depois **"SAVE AND CONTINUE"**
9. Em **"Test users"**, adicione seu email para testes
10. Clique em **"SAVE AND CONTINUE"**

## Passo 3: Criar Credenciais OAuth 2.0

1. No menu lateral, vá em **"APIs & Services"** > **"Credentials"**
2. Clique em **"+ CREATE CREDENTIALS"**
3. Selecione **"OAuth client ID"**
4. Em **"Application type"**, selecione **"Web application"**
5. Dê um nome (ex: "LDsports Web Client")
6. Em **"Authorized JavaScript origins"**, adicione:
   ```
   http://localhost:3000
   ```
7. Em **"Authorized redirect URIs"**, adicione:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Clique em **"CREATE"**
9. Uma janela aparecerá com suas credenciais:
   - **Client ID**: copie este valor
   - **Client secret**: copie este valor

## Passo 4: Configurar Variáveis de Ambiente

1. Abra o arquivo `frontend-next/.env.local`
2. Substitua os valores:
   ```env
   GOOGLE_CLIENT_ID=cole-aqui-seu-client-id
   GOOGLE_CLIENT_SECRET=cole-aqui-seu-client-secret
   ```

## Passo 5: Testar a Integração

1. Reinicie o servidor de desenvolvimento:
   ```bash
   cd frontend-next
   npm run dev
   ```

2. Acesse http://localhost:3000
3. Clique no botão **"Entrar"** no header
4. Você será redirecionado para a página de login do Google
5. Faça login com sua conta Google
6. Após autorizar, você será redirecionado de volta ao site logado

## Para Produção

Quando for colocar em produção, você precisará:

1. Adicionar o domínio de produção nas **"Authorized JavaScript origins"**:
   ```
   https://seu-dominio.com
   ```

2. Adicionar o callback de produção nas **"Authorized redirect URIs"**:
   ```
   https://seu-dominio.com/api/auth/callback/google
   ```

3. Atualizar a variável `NEXTAUTH_URL` no Vercel/Railway:
   ```
   NEXTAUTH_URL=https://seu-dominio.com
   ```

4. Publicar o app OAuth no Google Cloud Console:
   - Vá em **"OAuth consent screen"**
   - Clique em **"PUBLISH APP"**

## Solução de Problemas

### Erro: redirect_uri_mismatch

Verifique se o URI de redirecionamento no Google Cloud Console está **exatamente** igual a:
```
http://localhost:3000/api/auth/callback/google
```

### Erro: invalid_client

Verifique se o `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos no arquivo `.env.local`.

### Usuário não consegue fazer login

Certifique-se de que o email está adicionado como **"Test user"** na tela de consentimento OAuth.
