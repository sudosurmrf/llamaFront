import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../api/apiService';
import {
  mockProducts,
  mockCategories,
  mockSpecials,
  mockPromotions,
  mockBanners,
} from '../api/mockData';

const BakeryContext = createContext(null);

// Set to false to use real API, true to use mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const BakeryProvider = ({ children }) => {
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProducts(mockProducts);
        setCategories(mockCategories);
        setSpecials(mockSpecials);
        setPromotions(mockPromotions);
        setBanners(mockBanners);
      } else {
        // Use real API
        const [
          productsRes,
          categoriesRes,
          specialsRes,
          promotionsRes,
          bannersRes,
          settingsRes,
        ] = await Promise.all([
          apiService.getProducts().catch(() => ({ products: [] })),
          apiService.getCategories().catch(() => ({ categories: [] })),
          apiService.getSpecials().catch(() => ({ specials: [] })),
          apiService.getPromotions().catch(() => ({ promotions: [] })),
          apiService.getBanners().catch(() => ({ banners: [] })),
          apiService.getSettings().catch(() => ({ settings: {} })),
        ]);

        setProducts(productsRes.products || []);
        setCategories(categoriesRes.categories || []);
        setSpecials(specialsRes.specials || []);
        setPromotions(promotionsRes.promotions || []);
        setBanners(bannersRes.banners || []);
        setSettings(settingsRes.settings || {});
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Computed values
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured && p.active);
  }, [products]);

  const activeSpecials = useMemo(() => {
    const now = new Date();
    return specials.filter((s) => {
      const start = new Date(s.start_date || s.startDate);
      const end = new Date(s.end_date || s.endDate);
      return s.active && now >= start && now <= end;
    });
  }, [specials]);

  const activePromotions = useMemo(() => {
    const now = new Date();
    return promotions.filter((p) => {
      const start = new Date(p.start_date || p.startDate);
      const end = new Date(p.end_date || p.endDate);
      return p.active && now >= start && now <= end;
    });
  }, [promotions]);

  const activeBanners = useMemo(() => {
    const now = new Date();
    const dismissed = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
    return banners.filter((b) => {
      const start = new Date(b.start_date || b.startDate);
      const end = new Date(b.end_date || b.endDate);
      return b.active && now >= start && now <= end && !dismissed.includes(b.id);
    });
  }, [banners]);

  // Product CRUD
  const createProduct = async (data, files = []) => {
    if (USE_MOCK_DATA) {
      const newProduct = {
        ...data,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    }

    const response = await apiService.createProduct(data, files);
    setProducts((prev) => [...prev, response.product]);
    return response.product;
  };

  const updateProduct = async (id, data, files = []) => {
    if (USE_MOCK_DATA) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return;
    }

    const response = await apiService.updateProduct(id, data, files);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? response.product : p))
    );
    return response.product;
  };

  const deleteProduct = async (id) => {
    if (USE_MOCK_DATA) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    await apiService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Category CRUD
  const createCategory = async (data, file = null) => {
    if (USE_MOCK_DATA) {
      const newCategory = {
        ...data,
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
      };
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    }

    const response = await apiService.createCategory(data, file);
    setCategories((prev) => [...prev, response.category]);
    return response.category;
  };

  const updateCategory = async (id, data, file = null) => {
    if (USE_MOCK_DATA) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
      return;
    }

    const response = await apiService.updateCategory(id, data, file);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? response.category : c))
    );
    return response.category;
  };

  const deleteCategory = async (id) => {
    if (USE_MOCK_DATA) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return;
    }

    await apiService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Special CRUD
  const createSpecial = async (data, file = null) => {
    if (USE_MOCK_DATA) {
      const newSpecial = {
        ...data,
        id: Math.max(...specials.map((s) => s.id), 0) + 1,
        usedCount: 0,
      };
      setSpecials((prev) => [...prev, newSpecial]);
      return newSpecial;
    }

    const response = await apiService.createSpecial(data, file);
    setSpecials((prev) => [...prev, response.special]);
    return response.special;
  };

  const updateSpecial = async (id, data, file = null) => {
    if (USE_MOCK_DATA) {
      setSpecials((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
      return;
    }

    const response = await apiService.updateSpecial(id, data, file);
    setSpecials((prev) =>
      prev.map((s) => (s.id === id ? response.special : s))
    );
    return response.special;
  };

  const deleteSpecial = async (id) => {
    if (USE_MOCK_DATA) {
      setSpecials((prev) => prev.filter((s) => s.id !== id));
      return;
    }

    await apiService.deleteSpecial(id);
    setSpecials((prev) => prev.filter((s) => s.id !== id));
  };

  // Promotion CRUD
  const createPromotion = async (data, file = null) => {
    if (USE_MOCK_DATA) {
      const newPromotion = {
        ...data,
        id: Math.max(...promotions.map((p) => p.id), 0) + 1,
      };
      setPromotions((prev) => [...prev, newPromotion]);
      return newPromotion;
    }

    const response = await apiService.createPromotion(data, file);
    setPromotions((prev) => [...prev, response.promotion]);
    return response.promotion;
  };

  const updatePromotion = async (id, data, file = null) => {
    if (USE_MOCK_DATA) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return;
    }

    const response = await apiService.updatePromotion(id, data, file);
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? response.promotion : p))
    );
    return response.promotion;
  };

  const deletePromotion = async (id) => {
    if (USE_MOCK_DATA) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    await apiService.deletePromotion(id);
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  // Banner CRUD
  const createBanner = async (data) => {
    if (USE_MOCK_DATA) {
      const newBanner = {
        ...data,
        id: Math.max(...banners.map((b) => b.id), 0) + 1,
      };
      setBanners((prev) => [...prev, newBanner]);
      return newBanner;
    }

    const response = await apiService.createBanner(data);
    setBanners((prev) => [...prev, response.banner]);
    return response.banner;
  };

  const updateBanner = async (id, data) => {
    if (USE_MOCK_DATA) {
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...data } : b))
      );
      return;
    }

    const response = await apiService.updateBanner(id, data);
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? response.banner : b))
    );
    return response.banner;
  };

  const deleteBanner = async (id) => {
    if (USE_MOCK_DATA) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      return;
    }

    await apiService.deleteBanner(id);
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Dismiss banner
  const dismissBanner = (id) => {
    const dismissed = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
    if (!dismissed.includes(id)) {
      localStorage.setItem('dismissedBanners', JSON.stringify([...dismissed, id]));
      // Force re-render by updating state
      setBanners((prev) => [...prev]);
    }
  };

  const value = {
    // Data
    products,
    categories,
    specials,
    promotions,
    banners,
    settings,

    // Computed
    featuredProducts,
    activeSpecials,
    activePromotions,
    activeBanners,

    // State
    loading,
    error,

    // Refresh data
    refreshData: loadData,

    // Product actions
    createProduct,
    updateProduct,
    deleteProduct,

    // Category actions
    createCategory,
    updateCategory,
    deleteCategory,

    // Special actions
    createSpecial,
    updateSpecial,
    deleteSpecial,

    // Promotion actions
    createPromotion,
    updatePromotion,
    deletePromotion,

    // Banner actions
    createBanner,
    updateBanner,
    deleteBanner,
    dismissBanner,
  };

  return (
    <BakeryContext.Provider value={value}>
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};

export default BakeryContext;
