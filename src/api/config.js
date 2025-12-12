// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const S3_BASE_URL = import.meta.env.VITE_S3_URL || 'https://llama-bakery-images.s3.us-east-1.amazonaws.com';

// API endpoints
export const ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  CATEGORIES_REORDER: '/categories/reorder/batch',

  // Specials & Deals
  SPECIALS: '/specials',
  SPECIAL_BY_ID: (id) => `/specials/${id}`,
  VALIDATE_PROMO_CODE: '/specials/validate-code',

  // Promotions
  PROMOTIONS: '/promotions',
  PROMOTION_BY_ID: (id) => `/promotions/${id}`,
  PROMOTIONS_REORDER: '/promotions/reorder/batch',

  // Banners/Announcements
  BANNERS: '/banners',
  BANNER_BY_ID: (id) => `/banners/${id}`,

  // Settings
  SETTINGS: '/settings',
  SETTING_BY_KEY: (key) => `/settings/${key}`,
  SETTINGS_RESET: '/settings/reset',

  // Image Upload
  UPLOAD_SINGLE: '/upload/single',
  UPLOAD_MULTIPLE: '/upload/multiple',
  DELETE_IMAGE: '/upload',

  // Auth (for admin)
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_TOKEN: '/auth/me',
  UPDATE_PROFILE: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  USERS: '/auth/users',
  USER_STATUS: (id) => `/auth/users/${id}/status`,

  // Health
  HEALTH: '/health',
};
