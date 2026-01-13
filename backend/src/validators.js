const { z } = require('zod');

// Schema para login
const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Password é obrigatório'),
});

// Schema para produto
const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.number().positive('Preço deve ser positivo'),
  team: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
});

// Schema para review
const reviewSchema = z.object({
  productId: z.union([z.string(), z.number()]),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comentário é obrigatório'),
  author: z.string().min(1, 'Nome é obrigatório'),
});

// Middleware de validação
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: error.errors,
    });
  }
};

module.exports = {
  loginSchema,
  productSchema,
  reviewSchema,
  validate,
};
