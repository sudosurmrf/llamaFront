import { API_BASE_URL, ENDPOINTS } from './config';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Form data request (for file uploads)
  async formDataRequest(endpoint, formData, method = 'POST') {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: this.getAuthHeaders(),
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.PRODUCTS}?${queryString}` : ENDPOINTS.PRODUCTS;
    return this.request(endpoint);
  }

  async getProductById(id) {
    return this.request(ENDPOINTS.PRODUCT_BY_ID(id));
  }

  async getFeaturedProducts() {
    return this.getProducts({ featured: true });
  }

  async getProductsByCategory(categoryId) {
    return this.getProducts({ category: categoryId });
  }

  async createProduct(data, files = []) {
    const formData = new FormData();

    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    // Add files
    files.forEach(file => {
      formData.append('images', file);
    });

    return this.formDataRequest(ENDPOINTS.PRODUCTS, formData);
  }

  async updateProduct(id, data, files = []) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    files.forEach(file => {
      formData.append('images', file);
    });

    return this.formDataRequest(ENDPOINTS.PRODUCT_BY_ID(id), formData, 'PUT');
  }

  async deleteProduct(id) {
    return this.request(ENDPOINTS.PRODUCT_BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.CATEGORIES}?${queryString}` : ENDPOINTS.CATEGORIES;
    return this.request(endpoint);
  }

  async getCategoryById(id, withProducts = false) {
    const endpoint = withProducts
      ? `${ENDPOINTS.CATEGORY_BY_ID(id)}?withProducts=true`
      : ENDPOINTS.CATEGORY_BY_ID(id);
    return this.request(endpoint);
  }

  async createCategory(data, file = null) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (file) {
      formData.append('image', file);
    }

    return this.formDataRequest(ENDPOINTS.CATEGORIES, formData);
  }

  async updateCategory(id, data, file = null) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (file) {
      formData.append('image', file);
    }

    return this.formDataRequest(ENDPOINTS.CATEGORY_BY_ID(id), formData, 'PUT');
  }

  async deleteCategory(id) {
    return this.request(ENDPOINTS.CATEGORY_BY_ID(id), {
      method: 'DELETE',
    });
  }

  async reorderCategories(orders) {
    return this.request(ENDPOINTS.CATEGORIES_REORDER, {
      method: 'PUT',
      body: JSON.stringify({ orders }),
    });
  }

  // Specials & Deals
  async getSpecials(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.SPECIALS}?${queryString}` : ENDPOINTS.SPECIALS;
    return this.request(endpoint);
  }

  async getActiveSpecials() {
    return this.getSpecials(); // Backend already filters to active by default for public
  }

  async getSpecialById(id) {
    return this.request(ENDPOINTS.SPECIAL_BY_ID(id));
  }

  async validatePromoCode(code) {
    return this.request(ENDPOINTS.VALIDATE_PROMO_CODE, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async createSpecial(data, file = null) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (file) {
      formData.append('image', file);
    }

    return this.formDataRequest(ENDPOINTS.SPECIALS, formData);
  }

  async updateSpecial(id, data, file = null) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (file) {
      formData.append('image', file);
    }

    return this.formDataRequest(ENDPOINTS.SPECIAL_BY_ID(id), formData, 'PUT');
  }

  async deleteSpecial(id) {
    return this.request(ENDPOINTS.SPECIAL_BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Promotions
  async getPromotions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.PROMOTIONS}?${queryString}` : ENDPOINTS.PROMOTIONS;
    return this.request(endpoint);
  }

  async getActivePromotions(location = null) {
    const params = location ? { location } : {};
    return this.getPromotions(params);
  }

  async getPromotionById(id) {
    return this.request(ENDPOINTS.PROMOTION_BY_ID(id));
  }

  async createPromotion(data, file = null) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (file) {
      formData.append('image', file);
    }

    return this.formDataRequest(ENDPOINTS.PROMOTIONS, formData);
  }

  async updatePromotion(id, data, file = null) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (file) {
      formData.append('image', file);
    }

    return this.formDataRequest(ENDPOINTS.PROMOTION_BY_ID(id), formData, 'PUT');
  }

  async deletePromotion(id) {
    return this.request(ENDPOINTS.PROMOTION_BY_ID(id), {
      method: 'DELETE',
    });
  }

  async reorderPromotions(orders) {
    return this.request(ENDPOINTS.PROMOTIONS_REORDER, {
      method: 'PUT',
      body: JSON.stringify({ orders }),
    });
  }

  // Banners/Announcements
  async getBanners(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${ENDPOINTS.BANNERS}?${queryString}` : ENDPOINTS.BANNERS;
    return this.request(endpoint);
  }

  async getActiveBanners(location = null) {
    const params = location ? { location } : {};
    return this.getBanners(params);
  }

  async getBannerById(id) {
    return this.request(ENDPOINTS.BANNER_BY_ID(id));
  }

  async createBanner(data) {
    return this.request(ENDPOINTS.BANNERS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBanner(id, data) {
    return this.request(ENDPOINTS.BANNER_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBanner(id) {
    return this.request(ENDPOINTS.BANNER_BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings() {
    return this.request(ENDPOINTS.SETTINGS);
  }

  async getSetting(key) {
    return this.request(ENDPOINTS.SETTING_BY_KEY(key));
  }

  async updateSetting(key, value) {
    return this.request(ENDPOINTS.SETTING_BY_KEY(key), {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async updateSettings(settings) {
    return this.request(ENDPOINTS.SETTINGS, {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  }

  async resetSettings() {
    return this.request(ENDPOINTS.SETTINGS_RESET, {
      method: 'POST',
    });
  }

  // Image Upload (for S3)
  async uploadImage(file, folder = 'products') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return this.formDataRequest(ENDPOINTS.UPLOAD_SINGLE, formData);
  }

  async uploadImages(files, folder = 'products') {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    return this.formDataRequest(ENDPOINTS.UPLOAD_MULTIPLE, formData);
  }

  async deleteImage(urlOrKey) {
    return this.request(ENDPOINTS.DELETE_IMAGE, {
      method: 'DELETE',
      body: JSON.stringify({ url: urlOrKey }),
    });
  }

  // Auth
  async login(credentials) {
    const response = await this.request(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
    }
    return response;
  }

  async register(userData) {
    return this.request(ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  async verifyToken() {
    return this.request(ENDPOINTS.VERIFY_TOKEN);
  }

  async updateProfile(data) {
    return this.request(ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request(ENDPOINTS.CHANGE_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getUsers() {
    return this.request(ENDPOINTS.USERS);
  }

  async updateUserStatus(id, active) {
    return this.request(ENDPOINTS.USER_STATUS(id), {
      method: 'PUT',
      body: JSON.stringify({ active }),
    });
  }

  // Helper to check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('adminToken');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }

  // Health check
  async healthCheck() {
    return this.request(ENDPOINTS.HEALTH);
  }
}

export const apiService = new ApiService();
export default apiService;
