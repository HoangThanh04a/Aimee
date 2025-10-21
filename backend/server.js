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

// Logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'} - User-Agent: ${req.get('User-Agent') || 'No User-Agent'}`);
  next();
});

app.use(express.json());
// CORS configuration with fallback
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS allowed: No origin (mobile app)');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    const allowedOrigins = Array.isArray(API_CONFIG.CORS_ORIGIN) 
      ? API_CONFIG.CORS_ORIGIN 
      : [API_CONFIG.CORS_ORIGIN];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        const matches = regex.test(origin);
        if (matches) {
          console.log(`✅ CORS pattern match: ${allowedOrigin} matches ${origin}`);
        }
        return matches;
      }
      const exactMatch = allowedOrigin === origin;
      if (exactMatch) {
        console.log(`✅ CORS exact match: ${allowedOrigin} === ${origin}`);
      }
      return exactMatch;
    });
    
    if (isAllowed) {
      console.log('✅ CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      // For debugging, temporarily allow all origins
      console.log('⚠️  TEMPORARILY ALLOWING ALL ORIGINS FOR DEBUGGING');
      callback(null, true);
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
    status: 'running',
    timestamp: new Date().toISOString(),
    origin: req.get('Origin') || 'No Origin'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString(),
      origin: req.get('Origin') || 'No Origin',
      userAgent: req.get('User-Agent') || 'No User-Agent',
      server: 'Aimee Coffee API v1.0.0'
    });
  } catch (error) {
    console.error('Error in /api/test:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working!',
    origin: req.get('Origin') || 'No Origin',
    timestamp: new Date().toISOString(),
    headers: {
      origin: req.get('Origin'),
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer')
    }
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

// Root route for domain validation
app.get('/', (req, res) => {
  res.status(200).send('Aimee API is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global Error Handler:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(API_CONFIG.PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${API_CONFIG.PORT}`);
  console.log(`🌐 API Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`📁 Upload Directory: ${API_CONFIG.UPLOAD_DIR}`);
  console.log(`🔗 CORS Origin: ${API_CONFIG.CORS_ORIGIN}`);
  console.log(`🚀 Server started at: ${new Date().toISOString()}`);
}); 