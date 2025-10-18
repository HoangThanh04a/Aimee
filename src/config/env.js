// Environment Configuration for Frontend
export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://aimee-s5vs.onrender.com/api',
  
  // Frontend Configuration
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://aimee-s5vs.onrender.com',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Aimee Coffee',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Feature Flags
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  
  // API Timeout
  API_TIMEOUT: 10000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

// Development helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Console helpers for development
export const devLog = (...args) => {
  if (isDevelopment && ENV_CONFIG.ENABLE_DEBUG) {
    console.log('[DEV]', ...args);
  }
};

export const devWarn = (...args) => {
  if (isDevelopment && ENV_CONFIG.ENABLE_DEBUG) {
    console.warn('[DEV WARNING]', ...args);
  }
};

export const devError = (...args) => {
  if (isDevelopment && ENV_CONFIG.ENABLE_DEBUG) {
    console.error('[DEV ERROR]', ...args);
  }
};
