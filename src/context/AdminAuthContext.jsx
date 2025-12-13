import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../api/config';

const AdminAuthContext = createContext(null);

const ADMIN_AUTH_STORAGE_KEY = 'llamaTreatsAdminAuth';
const ADMIN_TOKEN_KEY = 'adminToken'; // Used by apiService
const ADMIN_USER_KEY = 'adminUser'; // Used by apiService
const API_URL = API_BASE_URL;

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const { admin: savedAdmin, token: savedToken } = JSON.parse(savedAuth);
        setAdmin(savedAdmin);
        setToken(savedToken);
        // Sync with apiService storage keys
        localStorage.setItem(ADMIN_TOKEN_KEY, savedToken);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(savedAdmin));
        // Verify token is still valid
        verifyToken(savedToken);
      } catch (e) {
        console.error('Failed to parse saved admin auth:', e);
        localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Save auth state to localStorage
  const saveAuth = useCallback((adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    // Save to both storage keys for compatibility with apiService
    localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify({ admin: adminData, token: authToken }));
    localStorage.setItem(ADMIN_TOKEN_KEY, authToken);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));
  }, []);

  // Clear auth state
  const clearAuth = useCallback(() => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }, []);

  // Verify token with backend
  const verifyToken = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        clearAuth();
        return false;
      }

      const data = await response.json();
      setAdmin(data.user);
      return true;
    } catch (err) {
      console.error('Admin token verification failed:', err);
      clearAuth();
      return false;
    }
  };

  // Login
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      saveAuth(data.user, data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  // Logout
  const logout = useCallback(() => {
    clearAuth();
    setError(null);
  }, [clearAuth]);

  const value = {
    admin,
    token,
    loading,
    error,
    isAuthenticated: !!admin && !!token,
    isAdmin: admin?.role === 'admin',
    login,
    logout,
    clearError: () => setError(null),
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
