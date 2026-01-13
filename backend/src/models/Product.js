const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'image',
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
      default: [],
    },
    team: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Índices para melhorar performance de busca
productSchema.index({ name: 'text', team: 'text' });
productSchema.index({ team: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
