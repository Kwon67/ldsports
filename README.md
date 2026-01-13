# LDSports

E-commerce de camisas de futebol desenvolvido com Next.js e Express.

## Estrutura do Projeto

```
ldsports/
├── frontend-next/    # Frontend Next.js 16
├── backend/          # API REST com Express
└── package.json      # Scripts principais do monorepo
```

## Tecnologias

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Axios

### Backend
- Express.js
- Cloudinary (upload de imagens)
- Helmet (segurança)
- Express Rate Limit
- Zod (validação)
- Multer (upload de arquivos)

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Configuração

### 1. Instalar dependências

```bash
npm install
cd frontend-next && npm install
cd ../backend && npm install
```

### 2. Configurar variáveis de ambiente

#### Backend
Crie o arquivo `backend/.env` baseado no `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Preencha com suas credenciais do Cloudinary:
```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
PORT=4001
```

#### Frontend
Crie o arquivo `frontend-next/.env.local` se necessário:

```bash
cp frontend-next/.env.example frontend-next/.env.local
```

## Desenvolvimento

### Rodar frontend e backend simultaneamente
```bash
npm run dev
```

### Rodar separadamente
```bash
# Frontend (porta 3000)
npm run dev:frontend

# Backend (porta 4001)
npm run dev:backend
```

## Scripts Disponíveis

- `npm run dev` - Inicia frontend e backend
- `npm run build` - Build do frontend
- `npm run lint` - Lint em frontend e backend
- `npm run format` - Formata código com Prettier
- `npm run format:check` - Verifica formatação

## Build

```bash
npm run build
```

## Funcionalidades

- Catálogo de produtos com filtros
- Upload de imagens via Cloudinary
- Sistema de avaliações
- Painel administrativo
- Rate limiting e segurança
- Responsive design

## Estrutura da API

- `GET /api/products` - Lista produtos
- `GET /api/products/:id` - Detalhes do produto
- `POST /api/admin/products` - Criar produto
- `PUT /api/admin/products/:id` - Atualizar produto
- `DELETE /api/admin/products/:id` - Remover produto
- `GET /api/teams` - Lista times
- `GET /api/reviews` - Lista avaliações

## Segurança

- Helmet para headers de segurança
- Rate limiting (100 req/15min por IP)
- CORS configurado
- Validação de dados com Zod
- Variáveis de ambiente para credenciais

## Licença

MIT
