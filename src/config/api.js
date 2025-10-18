// Frontend API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://aimee-s5vs.onrender.com/api',
  
  // Frontend URL
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://aimee-s5vs.onrender.com',
  
  // Timeout for API calls (in milliseconds)
  TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

// API Endpoints for Frontend
export const API_ENDPOINTS = {
  // Categories
  CATEGORIES: {
    BASE: `${API_CONFIG.BASE_URL}/categories`,
    SEARCH: `${API_CONFIG.BASE_URL}/categories/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/categories/${id}`
  },
  
  // Sizes
  SIZES: {
    BASE: `${API_CONFIG.BASE_URL}/sizes`,
    SEARCH: `${API_CONFIG.BASE_URL}/sizes/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/sizes/${id}`
  },
  
  // Products
  PRODUCTS: {
    BASE: `${API_CONFIG.BASE_URL}/products`,
    SEARCH: `${API_CONFIG.BASE_URL}/products/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/products/${id}`,
    BY_CATEGORY: (categoryId) => `${API_CONFIG.BASE_URL}/products?category_id=${categoryId}`
  },
  
  // Product Sizes
  PRODUCT_SIZES: {
    BASE: `${API_CONFIG.BASE_URL}/product-sizes`,
    SEARCH: `${API_CONFIG.BASE_URL}/product-sizes/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/product-sizes/${id}`,
    BY_PRODUCT: (productId) => `${API_CONFIG.BASE_URL}/product-sizes/product/${productId}`
  },
  
  // Combos
  COMBOS: {
    BASE: `${API_CONFIG.BASE_URL}/combos`,
    SEARCH: `${API_CONFIG.BASE_URL}/combos/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/combos/${id}`,
    WITH_ITEMS: (id) => `${API_CONFIG.BASE_URL}/combos/${id}/items`
  },
  
  // Orders
  ORDERS: {
    BASE: `${API_CONFIG.BASE_URL}/orders`,
    SEARCH: `${API_CONFIG.BASE_URL}/orders/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/orders/${id}`,
    BY_USER: (zaloId) => `${API_CONFIG.BASE_URL}/orders?zalo_id=${zaloId}`
  },
  
  // Accounts
  ACCOUNTS: {
    BASE: `${API_CONFIG.BASE_URL}/accounts`,
    SEARCH: `${API_CONFIG.BASE_URL}/accounts/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/accounts/${id}`
  },
  
  // Bills
  BILLS: {
    BASE: `${API_CONFIG.BASE_URL}/bills`,
    SEARCH: `${API_CONFIG.BASE_URL}/bills/search`,
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/bills/${id}`
  },
  
  // Upload
  UPLOAD: `${API_CONFIG.BASE_URL}/upload`
};

// API Helper Functions
export const apiHelpers = {
  // Build query string from object
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },
  
  // Build full URL with query params
  buildUrl: (baseUrl, params = {}) => {
    const queryString = apiHelpers.buildQueryString(params);
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },
  
  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    return apiHelpers.buildUrl(API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId), params);
  },
  
  // Get product sizes by product
  getProductSizesByProduct: (productId) => {
    return API_ENDPOINTS.PRODUCT_SIZES.BY_PRODUCT(productId);
  },
  
  // Get orders by user
  getOrdersByUser: (zaloId, params = {}) => {
    return apiHelpers.buildUrl(API_ENDPOINTS.ORDERS.BY_USER(zaloId), params);
  }
};
