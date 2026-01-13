const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');

// Multer config - store in memory for cloudinary upload
const storage = multer.memoryStorage();
const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for images
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'), false);
    }
  },
});

const uploadVideo = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max for videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas vídeos são permitidos'), false);
    }
  },
});

// Hardcoded admin credentials
const ADMIN_USER = 'kwon';
const ADMIN_PASS = '251636';

// Login Endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, token: 'admin-token-ldsports-2024' });
  }
  return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
});

// Upload Image to Cloudinary
router.post('/upload', uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Convert buffer to base64 for cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ldsports/products',
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto:good' }],
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      type: 'image',
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
  }
});

// Upload Video to Cloudinary
router.post('/upload-video', uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum vídeo enviado' });
    }

    // Convert buffer to base64 for cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ldsports/products/videos',
      resource_type: 'video',
      eager: [{ format: 'mp4', video_codec: 'h264' }],
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      type: 'video',
    });
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do vídeo' });
  }
});

// Delete Media from Cloudinary (images or videos)
router.delete('/media/:publicId(*)', async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const isVideo = publicId.includes('/videos/');

    await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideo ? 'video' : 'image',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ error: 'Erro ao deletar mídia' });
  }
});

// Get all products (for admin)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Create Product
router.post('/products', async (req, res) => {
  try {
    console.log('Creating product with data:', JSON.stringify(req.body));
    const newProduct = new Product(req.body);
    const created = await newProduct.save();
    console.log('Product created successfully:', created._id);
    res.json(created);
  } catch (error) {
    console.error('Error creating product:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
  }
});

// Update Product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('Updating product:', id, 'with data:', JSON.stringify(updates));
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (updated) {
      console.log('Product updated successfully:', updated._id);
      res.json(updated);
    } else {
      console.log('Product not found:', id);
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Error updating product:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting product:', id);

    // Get product first to delete its media from cloudinary
    const product = await Product.findById(id);
    if (product) {
      try {
        // Delete all images from the images array
        if (product.images && Array.isArray(product.images)) {
          for (const img of product.images) {
            if (img.publicId) {
              await cloudinary.uploader.destroy(img.publicId);
            }
          }
        }

        // Delete video if exists
        if (product.video && product.video.publicId) {
          await cloudinary.uploader.destroy(product.video.publicId, {
            resource_type: 'video',
          });
        }

        // Legacy: delete single cloudinaryId if exists
        if (product.cloudinaryId) {
          await cloudinary.uploader.destroy(product.cloudinaryId);
        }
      } catch (e) {
        console.error('Error deleting media from cloudinary:', e);
      }
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (deleted) {
      console.log('Product deleted successfully:', id);
      res.json({ success: true });
    } else {
      console.log('Product not found for deletion:', id);
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Error deleting product:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ error: 'Erro ao deletar produto', details: error.message });
  }
});

module.exports = router;
