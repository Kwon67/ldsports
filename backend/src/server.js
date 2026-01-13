require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const productsRoutes = require('./routes/products');
const teamsRoutes = require('./routes/teams');
const reviewsRoutes = require('./routes/reviews');

// Conectar ao MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 4001;

const adminRoutes = require('./routes/admin');

// Segurança: Helmet para headers de segurança
app.use(helmet());

// Segurança: Rate limiting (100 requisições por 15 minutos por IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware de log para debug
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.get('origin')}`
  );
  next();
});

// Configuração CORS dinâmica para permitir acesso da rede
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origin (como curl e apps mobile) ou qualquer origem local
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('LDsports API online');
});

app.use('/api/products', productsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewsRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor LDsports rodando na porta ${PORT} (acessível na rede)`);
});

