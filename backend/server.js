// Backend for PostgreSQL
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import config
import { API_CONFIG } from './config/api.js';

// Import controllers
import * as categoryController from './controllers/categoryController.js';
import * as sizeController from './controllers/sizeController.js';
import * as productController from './controllers/productController.js';
import * as productSizeController from './controllers/productSizeController.js';
import * as comboController from './controllers/comboController.js';
import * as orderController from './controllers/orderController.js';
import * as accountController from './controllers/accountController.js';
import * as billController from './controllers/billController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const allowedOrigins = Array.isArray(API_CONFIG.CORS_ORIGIN) 
      ? API_CONFIG.CORS_ORIGIN 
      : [API_CONFIG.CORS_ORIGIN];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Cấu hình multer lưu vào static
const staticDir = path.join(__dirname, API_CONFIG.UPLOAD_DIR);
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, staticDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: API_CONFIG.MAX_FILE_SIZE
  }
});

// ===========================
// ROUTES
// ===========================

// API Info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Aimee Coffee API',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      sizes: '/api/sizes', 
      products: '/api/products',
      productSizes: '/api/product-sizes',
      combos: '/api/combos',
      orders: '/api/orders',
      accounts: '/api/accounts',
      bills: '/api/bills',
      upload: '/api/upload'
    },
    status: 'running'
  });
});

// Categories routes
app.get('/api/categories', categoryController.getCategories);
app.get('/api/categories/search', categoryController.searchCategories);
app.get('/api/categories/:id', categoryController.getCategoryById);
app.post('/api/categories', categoryController.createCategory);
app.put('/api/categories/:id', categoryController.updateCategory);
app.delete('/api/categories/:id', categoryController.deleteCategory);

// Sizes routes
app.get('/api/sizes', sizeController.getSizes);
app.get('/api/sizes/search', sizeController.searchSizes);
app.get('/api/sizes/:id', sizeController.getSizeById);
app.post('/api/sizes', sizeController.createSize);
app.put('/api/sizes/:id', sizeController.updateSize);
app.delete('/api/sizes/:id', sizeController.deleteSize);

// Products routes
app.get('/api/products', productController.getProducts);
app.get('/api/products/search', productController.searchProducts);
app.get('/api/products/:id', productController.getProductById);
app.post('/api/products', productController.createProduct);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);

// Product Sizes routes
app.get('/api/product-sizes', productSizeController.getProductSizes);
app.get('/api/product-sizes/search', productSizeController.searchProductSizes);
app.get('/api/product-sizes/:id', productSizeController.getProductSizeById);
app.get('/api/product-sizes/product/:productId', productSizeController.getProductSizesByProductId);
app.post('/api/product-sizes', productSizeController.createProductSize);
app.put('/api/product-sizes/:id', productSizeController.updateProductSize);
app.delete('/api/product-sizes/:id', productSizeController.deleteProductSize);

// Combos routes
app.get('/api/combos', comboController.getCombos);
app.get('/api/combos/search', comboController.searchCombos);
app.get('/api/combos/:id', comboController.getComboById);
app.get('/api/combos/:id/items', comboController.getComboWithItems);
app.post('/api/combos', comboController.createCombo);
app.put('/api/combos/:id', comboController.updateCombo);
app.delete('/api/combos/:id', comboController.deleteCombo);

// Orders routes
app.get('/api/orders', orderController.getOrders);
app.get('/api/orders/search', orderController.searchOrders);
app.get('/api/orders/:id', orderController.getOrderById);
app.post('/api/orders', orderController.createOrder);
app.put('/api/orders/:id', orderController.updateOrder);
app.delete('/api/orders/:id', orderController.deleteOrder);

// Accounts routes
app.get('/api/accounts', accountController.getAccounts);
app.get('/api/accounts/search', accountController.searchAccounts);
app.get('/api/accounts/:id', accountController.getAccountById);
app.post('/api/accounts', accountController.createAccount);
app.post('/api/accounts/upsert', accountController.createOrUpdateAccount); // Endpoint cho Zalo Mini App
app.put('/api/accounts/:id', accountController.updateAccount);
app.delete('/api/accounts/:id', accountController.deleteAccount);

// Bills routes
app.get('/api/bills', billController.getBills);
app.get('/api/bills/search', billController.searchBills);
app.get('/api/bills/:id', billController.getBillById);
app.post('/api/bills', billController.createBill);
app.put('/api/bills/:id', billController.updateBill);
app.delete('/api/bills/:id', billController.deleteBill);

// Upload image route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có file được upload' });
  }
  res.json({ 
    success: true, 
    imageUrl: `/static/${req.file.filename}` 
  });
});

// Start server
app.listen(API_CONFIG.PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${API_CONFIG.PORT}`);
  console.log(`🌐 API Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`📁 Upload Directory: ${API_CONFIG.UPLOAD_DIR}`);
  console.log(`🔗 CORS Origin: ${API_CONFIG.CORS_ORIGIN}`);
}); 