require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const dbData = require('../db.json');

const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado ao MongoDB');

    // Limpar produtos existentes
    await Product.deleteMany({});
    console.log('✓ Produtos existentes removidos');

    // Inserir produtos do db.json
    const products = await Product.insertMany(dbData.products);
    console.log(`✓ ${products.length} produtos inseridos com sucesso!`);

    console.log('\n🎉 Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

seedDatabase();
