const fs = require('fs');
const path = require('path');
const initialData = require('./data/products');

const DB_PATH = path.join(__dirname, 'db.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
  const data = {
    products: initialData.products || [],
    reviews: [],
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  // Ensure reviews array exists
  if (!db.reviews) {
    db.reviews = [];
  }
  return db;
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  getAllProducts: () => {
    const db = readDB();
    return db.products;
  },
  getProductById: id => {
    const db = readDB();
    return db.products.find(p => p.id == id);
  },
  createProduct: product => {
    const db = readDB();
    // Generate simple numeric ID if not provided, basically max + 1
    const maxId = db.products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct = { ...product, id: maxId + 1 };
    db.products.push(newProduct);
    writeDB(db);
    return newProduct;
  },
  updateProduct: (id, updates) => {
    const db = readDB();
    const index = db.products.findIndex(p => p.id == id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...updates };
      writeDB(db);
      return db.products[index];
    }
    return null;
  },
  deleteProduct: id => {
    const db = readDB();
    const filtered = db.products.filter(p => p.id != id);
    if (filtered.length !== db.products.length) {
      db.products = filtered;
      writeDB(db);
      return true;
    }
    return false;
  },
  // Reviews
  getReviewsByProduct: productId => {
    const db = readDB();
    return db.reviews.filter(r => r.productId == productId);
  },
  addReview: ({ productId, rating, comment, author }) => {
    const db = readDB();
    const review = {
      id: Date.now().toString(),
      productId,
      rating,
      comment,
      author,
      createdAt: new Date().toISOString(),
    };
    db.reviews.push(review);
    writeDB(db);
    return review;
  },
};

