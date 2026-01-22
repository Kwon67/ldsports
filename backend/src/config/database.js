const mongoose = require('mongoose');

// Cache de conexão para ambiente serverless (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Se já está conectado e a conexão está pronta, retorna
  if (cached.conn && mongoose.connection.readyState === 1) {
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
      
      // Seed dos admins iniciais
      const Admin = require('../models/Admin');
      await Admin.seedAdmins();
      console.log('Admin seeding concluído');
      
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

