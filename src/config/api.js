// Frontend API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  // In development (browser or Zalo simulator), always use Vite proxy '/api'
  BASE_URL: import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || 'https://aimee-s5vs.onrender.com/api'),
  
  // Frontend URL
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://aimee-s5vs.onrender.com',
  
  // Timeout for API calls (in milliseconds) - tăng timeout cho mobile
  TIMEOUT: 30000,
  
  // Retry configuration - tăng retry cho mobile
  MAX_RETRIES: 5,
  RETRY_DELAY: 2000
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
    BY_ID: (id) => `${API_CONFIG.BASE_URL}/accounts/${id}`,
    UPSERT: `${API_CONFIG.BASE_URL}/accounts/upsert`
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
  },

  // Enhanced fetch with retry logic
  fetchWithRetry: async (url, options = {}, retries = API_CONFIG.MAX_RETRIES) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    try {
      console.log(`🔄 Fetching: ${url}`);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ Fetch failed (attempt ${API_CONFIG.MAX_RETRIES - retries + 1}):`, error);
      
      if (retries > 0 && !controller.signal.aborted) {
        console.log(`🔄 Retrying in ${API_CONFIG.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        return apiHelpers.fetchWithRetry(url, options, retries - 1);
      }
      
      throw error;
    }
  }
};
