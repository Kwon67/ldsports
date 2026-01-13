const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET produto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

module.exports = router;
