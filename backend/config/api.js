// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.API_BASE_URL || 'https://aimee-s5vs.onrender.com/api',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://aimee-s5vs.onrender.com',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres.srvgaxbehoxiknfrcnzm:jlooZJWnH1sPL9zz@aws-1-us-east-1.pooler.supabase.com:6543/postgres',
  
  // Server
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // File Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || '../src/static',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  
  // CORS - Allow multiple origins for Zalo Mini App
  CORS_ORIGIN: process.env.CORS_ORIGIN || [
    'https://aimee-s5vs.onrender.com',
    'https://h5.zdn.vn',  // Zalo Mini App actual domain
    'https://*.h5.zdn.vn',
    'https://zaloapp.com',
    'https://*.zaloapp.com',
    'https://mini.zaloapp.com',
    'https://*.mini.zaloapp.com',
    'https://zalo.me',
    'https://*.zalo.me',
    'https://chat.zalo.me',
    'https://*.chat.zalo.me',
    'https://oa.zalo.me',
    'https://*.oa.zalo.me',
    'https://developers.zalo.me',
    'https://*.developers.zalo.me',
    'https://zmp.zaloapp.com',
    'https://*.zmp.zaloapp.com'
  ],
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE) || 20,
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  
  // JWT (for future use)
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Categories
  CATEGORIES: {
    BASE: '/api/categories',
    SEARCH: '/api/categories/search',
    BY_ID: (id) => `/api/categories/${id}`
  },
  
  // Sizes
  SIZES: {
    BASE: '/api/sizes',
    SEARCH: '/api/sizes/search',
    BY_ID: (id) => `/api/sizes/${id}`
  },
  
  // Products
  PRODUCTS: {
    BASE: '/api/products',
    SEARCH: '/api/products/search',
    BY_ID: (id) => `/api/products/${id}`,
    BY_CATEGORY: (categoryId) => `/api/products?category_id=${categoryId}`
  },
  
  // Product Sizes
  PRODUCT_SIZES: {
    BASE: '/api/product-sizes',
    SEARCH: '/api/product-sizes/search',
    BY_ID: (id) => `/api/product-sizes/${id}`,
    BY_PRODUCT: (productId) => `/api/product-sizes/product/${productId}`
  },
  
  // Combos
  COMBOS: {
    BASE: '/api/combos',
    SEARCH: '/api/combos/search',
    BY_ID: (id) => `/api/combos/${id}`,
    WITH_ITEMS: (id) => `/api/combos/${id}/items`
  },
  
  // Orders
  ORDERS: {
    BASE: '/api/orders',
    SEARCH: '/api/orders/search',
    BY_ID: (id) => `/api/orders/${id}`,
    BY_USER: (zaloId) => `/api/orders?zalo_id=${zaloId}`
  },
  
  // Accounts
  ACCOUNTS: {
    BASE: '/api/accounts',
    SEARCH: '/api/accounts/search',
    BY_ID: (id) => `/api/accounts/${id}`
  },
  
  // Bills
  BILLS: {
    BASE: '/api/bills',
    SEARCH: '/api/bills/search',
    BY_ID: (id) => `/api/bills/${id}`
  },
  
  // Upload
  UPLOAD: '/api/upload'
};

// Frontend API URLs (for frontend to use)
export const FRONTEND_API_URLS = {
  // Base URL
  BASE: API_CONFIG.BASE_URL,
  
  // Categories
  CATEGORIES: `${API_CONFIG.BASE_URL}/categories`,
  CATEGORIES_SEARCH: `${API_CONFIG.BASE_URL}/categories/search`,
  
  // Sizes
  SIZES: `${API_CONFIG.BASE_URL}/sizes`,
  SIZES_SEARCH: `${API_CONFIG.BASE_URL}/sizes/search`,
  
  // Products
  PRODUCTS: `${API_CONFIG.BASE_URL}/products`,
  PRODUCTS_SEARCH: `${API_CONFIG.BASE_URL}/products/search`,
  PRODUCTS_BY_CATEGORY: (categoryId) => `${API_CONFIG.BASE_URL}/products?category_id=${categoryId}`,
  
  // Product Sizes
  PRODUCT_SIZES: `${API_CONFIG.BASE_URL}/product-sizes`,
  PRODUCT_SIZES_BY_PRODUCT: (productId) => `${API_CONFIG.BASE_URL}/product-sizes/product/${productId}`,
  
  // Combos
  COMBOS: `${API_CONFIG.BASE_URL}/combos`,
  COMBOS_WITH_ITEMS: (id) => `${API_CONFIG.BASE_URL}/combos/${id}/items`,
  
  // Orders
  ORDERS: `${API_CONFIG.BASE_URL}/orders`,
  ORDERS_BY_USER: (zaloId) => `${API_CONFIG.BASE_URL}/orders?zalo_id=${zaloId}`,
  
  // Accounts
  ACCOUNTS: `${API_CONFIG.BASE_URL}/accounts`,
  
  // Bills
  BILLS: `${API_CONFIG.BASE_URL}/bills`,
  
  // Upload
  UPLOAD: `${API_CONFIG.BASE_URL}/upload`
};
