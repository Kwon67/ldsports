const express = require('express');
const router = express.Router();
const { teams } = require('../data/products');

router.get('/', (req, res) => {
  res.json(teams);
});

module.exports = router;
