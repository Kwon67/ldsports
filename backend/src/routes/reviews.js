const express = require('express');
const router = express.Router();
const db = require('../database');
const { reviewSchema, validate } = require('../validators');

// GET reviews por produto
router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  const reviews = db.getReviewsByProduct(productId);
  res.json(reviews);
});

// POST nova review
router.post('/', validate(reviewSchema), (req, res) => {
  const { productId, rating, comment, author } = req.body;
  const review = db.addReview({ productId, rating, comment, author });
  res.status(201).json(review);
});

// GET média de avaliação de um produto
router.get('/:productId/average', (req, res) => {
  const { productId } = req.params;
  const reviews = db.getReviewsByProduct(productId);
  if (reviews.length === 0) {
    return res.json({ average: 0, count: 0 });
  }
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  res.json({ average: Math.round(average * 10) / 10, count: reviews.length });
});

module.exports = router;
