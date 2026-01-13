const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const products = db.getAllProducts();
  res.json(products);
});

module.exports = router;
