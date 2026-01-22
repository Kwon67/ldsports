const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const Admin = require('../models/Admin');

// Rate limiter específico para uploads (mais restritivo)
const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // 20 uploads por 5 minutos
  message: { error: 'Muitos uploads. Aguarde alguns minutos e tente novamente.' },
  standardHeaders: true,
});

// Rate limiter para login (proteção contra brute force)
const isDevelopment = process.env.NODE_ENV !== 'production';
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDevelopment ? 50 : 5, // Dev: 50 tentativas, Prod: 5 tentativas
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
});

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

// Login Endpoint (com rate limiting para proteger contra brute force)
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios' });
    }

    // Buscar admin no banco (username já é lowercase no schema)
    const admin = await Admin.findOne({ username: username.toLowerCase(), isActive: true });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    // Verificar senha com bcrypt
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    return res.json({
      success: true,
      token: 'admin-token-ldsports-2024',
      user: admin.displayName || admin.username,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Upload Image to Cloudinary (com rate limiting)
router.post('/upload', uploadLimiter, uploadImage.single('image'), async (req, res) => {
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

// Upload Hero Image to Cloudinary (larger size for hero section, com rate limiting)
router.post('/upload-hero', uploadLimiter, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ldsports/hero',
      transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto:best' }],
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

// Upload Video to Cloudinary (com rate limiting)
router.post('/upload-video', uploadLimiter, uploadVideo.single('video'), async (req, res) => {
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
  } catch {
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

// Get Settings (usando MongoDB em vez de arquivo)
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.json({
      heroImages: settings.heroImages || [],
      heroImage: settings.heroImage || '',
    });
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({
      error: 'Erro ao buscar configurações',
      heroImages: [],
      heroImage: ''
    });
  }
});

// Update Settings (usando MongoDB em vez de arquivo)
router.put('/settings', async (req, res) => {
  try {
    const { heroImage, heroImages } = req.body;
    const updates = {
      heroImages: Array.isArray(heroImages) ? heroImages.filter(Boolean) : [],
      heroImage: heroImage || (heroImages?.[0] || ''),
    };
    const settings = await Settings.updateSettings(updates);
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Erro ao salvar configurações' });
  }
});

module.exports = router;
