const mongoose = require('mongoose');

// Cache de conexão para ambiente serverless (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, seeded: false };
}

const connectDB = async () => {
  // Se já está conectado, retorna a conexão existente
  if (cached.conn && cached.seeded) {
    return cached.conn;
  }

  // Se não há promise de conexão, cria uma nova
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(async (mongoose) => {
      console.log(`MongoDB conectado: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;

    // Seed dos admins iniciais (apenas uma vez)
    if (!cached.seeded) {
      const Admin = require('../models/Admin');
      await Admin.seedAdmins();
      cached.seeded = true;
      console.log('Admin seeding concluído');
    }

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
