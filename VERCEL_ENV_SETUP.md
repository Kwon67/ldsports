# 🔐 Configuração de Variáveis de Ambiente no Vercel

## Backend - Variáveis Necessárias

Configure estas variáveis no projeto **backend** no Vercel:

### 1. MongoDB
```
MONGODB_URI=mongodb+srv://ldsport-admin:%40qualcomm845@cluster0.srogyxy.mongodb.net/ldsports?appName=Cluster0
```

### 2. Cloudinary
```
CLOUDINARY_CLOUD_NAME=diuh0ditl
CLOUDINARY_API_KEY=253854183362134
CLOUDINARY_API_SECRET=oTHmlEJU5f7UROyHQVBoyqwt_8g
```

### 3. Node Environment
```
NODE_ENV=production
```

---

## Frontend - Variáveis Necessárias

Configure esta variável no projeto **ldsports** (frontend) no Vercel:

### API Backend URL
```
NEXT_PUBLIC_API_URL=https://backend-chi-six-83.vercel.app/api
```

---

## 📋 Como Configurar no Vercel

### Para o Backend:

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: **backend**
3. Vá em: **Settings** → **Environment Variables**
4. Para cada variável acima:
   - Clique em **Add New**
   - Cole o **Name** (ex: CLOUDINARY_CLOUD_NAME)
   - Cole o **Value** (ex: diuh0ditl)
   - Marque: ☑️ **Production** ☑️ **Preview** ☑️ **Development**
   - Clique em **Save**

5. Repita para todas as 4 variáveis

### Para o Frontend:

1. Ainda no dashboard do Vercel
2. Clique no projeto: **ldsports**
3. Vá em: **Settings** → **Environment Variables**
4. Adicione:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://backend-chi-six-83.vercel.app/api`
   - Marque: ☑️ **Production** ☑️ **Preview** ☑️ **Development**
   - Clique em **Save**

---

## 🚀 Após Configurar

**IMPORTANTE:** Depois de adicionar as variáveis, você DEVE fazer redeploy:

### Redeploy do Backend:
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deployment
3. Clique em **Redeploy**
4. **NÃO marque** "Use existing Build Cache" (precisa reconstruir com as novas variáveis)
5. Clique em **Redeploy**

### Redeploy do Frontend:
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deployment
3. Clique em **Redeploy**
4. **NÃO marque** "Use existing Build Cache"
5. Clique em **Redeploy**

---

## ✅ Como Verificar se Está Funcionando

### Teste o Backend:
```bash
# No terminal ou no navegador:
https://backend-chi-six-83.vercel.app

# Deve retornar: "LDsports API online"
```

### Teste o Upload:
1. Acesse: https://ldsports.vercel.app/admin
2. Faça login (kwon / 251636)
3. Vá em Configurações
4. Tente fazer upload de uma imagem
5. Deve funcionar sem erro 404

---

## 🔍 Checklist Final

Antes de testar, confirme:

**Backend:**
- [ ] MONGODB_URI configurada
- [ ] CLOUDINARY_CLOUD_NAME configurada
- [ ] CLOUDINARY_API_KEY configurada
- [ ] CLOUDINARY_API_SECRET configurada
- [ ] NODE_ENV=production configurada
- [ ] Redeploy feito SEM cache

**Frontend:**
- [ ] NEXT_PUBLIC_API_URL configurada
- [ ] URL aponta para: https://backend-chi-six-83.vercel.app/api
- [ ] Redeploy feito SEM cache

---

## 🆘 Se Ainda Não Funcionar

Abra o Console do Navegador (F12) em ldsports.vercel.app/admin e procure por:

```
[API Config] Using NEXT_PUBLIC_API_URL: ...
[Upload] API URL being used: ...
```

Se aparecer erro, me envie os logs completos!
