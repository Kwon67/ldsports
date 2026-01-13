# ⚠️ ERRO NO LOGIN DO GOOGLE - Como Resolver

## O Problema

Você está vendo "Server Error" quando clica em "Entrar com Google". Isso acontece porque o Google Cloud Console ainda não está configurado corretamente.

## ✅ Solução - Siga estes passos:

### Passo 1: Acesse o Google Cloud Console

1. Vá em: https://console.cloud.google.com/
2. Selecione seu projeto (ou crie um se não existir)

### Passo 2: Configure os URIs de Redirecionamento

1. No menu lateral, vá em **"APIs & Services"** > **"Credentials"**
2. Clique na sua credencial OAuth 2.0 Client ID
3. Em **"Authorized redirect URIs"**, clique em **"+ ADD URI"**
4. Cole EXATAMENTE este URI (copie e cole!):
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Clique em **"SAVE"**

### Passo 3: Configure JavaScript Origins (Opcional mas Recomendado)

1. Na mesma tela, em **"Authorized JavaScript origins"**
2. Clique em **"+ ADD URI"**
3. Cole:
   ```
   http://localhost:3000
   ```
4. Clique em **"SAVE"**

### Passo 4: Verifique o Client ID

Seu Client ID atual é:
```
1033982553846-mdiufs6paciou7icp753k4id8vtcv14.apps.googleusercontent.com
```

⚠️ **IMPORTANTE**: Verifique se este Client ID está completo!

Ele parece estar incompleto. Normalmente um Client ID do Google tem mais caracteres entre o `-` e `.apps.googleusercontent.com`.

**Exemplo de Client ID válido:**
```
1033982553846-abc123xyz456def789ghi012jkl345mn.apps.googleusercontent.com
```

Se o seu está diferente, **copie o Client ID correto** do Google Cloud Console e atualize no arquivo `.env.local`.

### Passo 5: Reinicie o Servidor

Depois de fazer as mudanças:

```bash
# Mate o servidor atual
Ctrl+C (no terminal onde o servidor está rodando)

# Inicie novamente
cd frontend-next
npm run dev
```

### Passo 6: Teste Novamente

1. Acesse http://localhost:3000
2. Clique em "Entrar"
3. Você deve ser redirecionado para o Google
4. Faça login e autorize
5. Você voltará ao site logado! ✅

## 🔍 Como Verificar se as Credenciais Estão Corretas

Execute este comando para testar:

```bash
curl -s http://localhost:3000/api/auth/providers | jq .
```

Se retornar um objeto com `"google"`, as credenciais foram carregadas.

## 📞 Ainda com Problemas?

Se ainda der erro, verifique:

1. ✅ O Client ID está completo e correto?
2. ✅ O Client Secret está correto?
3. ✅ O URI de redirecionamento está EXATAMENTE como mostrado acima?
4. ✅ Salvou as alterações no Google Cloud Console?
5. ✅ Reiniciou o servidor Next.js após as mudanças?

---

**Dica**: Às vezes o Google demora alguns minutos para propagar as mudanças. Se continuar com erro, aguarde 2-3 minutos e teste novamente.
