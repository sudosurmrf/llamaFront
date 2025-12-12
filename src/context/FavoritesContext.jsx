import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

const FAVORITES_STORAGE_KEY = 'llamaTreatsFavorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites from storage:', e);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((product) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === product.id)) {
        return prev;
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        description: product.description,
        categoryId: product.categoryId,
      }];
    });
  }, []);

  const removeFromFavorites = useCallback((productId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === product.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== product.id);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        description: product.description,
        categoryId: product.categoryId,
      }];
    });
  }, []);

  const isFavorite = useCallback((productId) => {
    return favorites.some((fav) => fav.id === productId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = {
    favorites,
    favoriteCount: favorites.length,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
