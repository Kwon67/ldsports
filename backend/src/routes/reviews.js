const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { reviewSchema, validate } = require('../validators');

// GET reviews por produto
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

// POST nova review
router.post('/', validate(reviewSchema), async (req, res) => {
  try {
    const { productId, rating, comment, author } = req.body;
    const review = new Review({ productId, rating, comment, author });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// GET média de avaliação de um produto
router.get('/:productId/average', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    res.json({ average: Math.round(average * 10) / 10, count: reviews.length });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular média' });
  }
});

module.exports = router;
