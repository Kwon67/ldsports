# Variáveis de Ambiente para a Vercel

Configure estas variáveis no painel da Vercel em:
**Settings → Environment Variables**

⚠️ Marque **Production, Preview e Development** para cada uma!

---

## Frontend (Next.js na Vercel)

### NextAuth Configuration

**Name:** `NEXTAUTH_URL`
**Value:** `https://seu-dominio.vercel.app`
⚠️ Substitua pelo seu domínio real da Vercel!

**Name:** `NEXTAUTH_SECRET`
**Value:** `M+7DxL3/KGesceuVSZPWN5v4eTLPn+zBIJloK2l0uvA=`

### Google OAuth

**Name:** `GOOGLE_CLIENT_ID`
**Value:** `1033982553846-mdiurs6pacioul7icp753k4ld8vtcv14.apps.googleusercontent.com`

**Name:** `GOOGLE_CLIENT_SECRET`
**Value:** `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U`

### Backend API URL

**Name:** `NEXT_PUBLIC_API_URL`
**Value:** `https://seu-backend-url/api`
⚠️ Substitua pela URL real do seu backend em produção!

---

## Depois de Adicionar as Variáveis:

1. ✅ Faça um redeploy na Vercel
2. ✅ Configure os URIs no Google Cloud Console (veja abaixo)

---

## URIs para Google Cloud Console

Acesse: https://console.cloud.google.com/apis/credentials

### Authorized JavaScript origins:
```
https://seu-dominio.vercel.app
```

### Authorized redirect URIs:
```
https://seu-dominio.vercel.app/api/auth/callback/google
```

⚠️ Substitua `seu-dominio.vercel.app` pelo domínio real!

---

## Como Encontrar Seu Domínio da Vercel:

1. Acesse seu projeto na Vercel
2. Vá em **Settings → Domains**
3. Copie o domínio principal (ex: `ldsports.vercel.app`)
4. Use esse domínio nas variáveis acima

---

## Checklist Final:

- [ ] Todas as 5 variáveis adicionadas na Vercel
- [ ] Marcadas para Production, Preview e Development
- [ ] URIs configurados no Google Cloud Console
- [ ] Redeploy feito na Vercel
- [ ] Testado o login em produção

🎉 Depois disso, o login com Google vai funcionar em produção!
