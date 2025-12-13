import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../api/config';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'llamaTreatsAuth';
const API_URL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const { user: savedUser, token: savedToken } = JSON.parse(savedAuth);
        setUser(savedUser);
        setToken(savedToken);
        // Verify token is still valid
        verifyToken(savedToken);
      } catch (e) {
        console.error('Failed to parse saved auth:', e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Save auth state to localStorage
  const saveAuth = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData, token: authToken }));
  }, []);

  // Clear auth state
  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  // Verify token with backend
  const verifyToken = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/customers/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        clearAuth();
        return false;
      }

      const data = await response.json();
      setUser(data.customer);
      return true;
    } catch (err) {
      console.error('Token verification failed:', err);
      clearAuth();
      return false;
    }
  };

  // Login
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/customers/login`, {
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

      saveAuth(data.customer, data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  // Register
  const register = useCallback(async ({ email, password, firstName, lastName, phone }) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/customers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Transform to snake_case for backend API
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      saveAuth(data.customer, data.token);
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

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    setError(null);

    // Transform to snake_case for backend API
    const snakeCaseUpdates = {};
    if (updates.firstName !== undefined) snakeCaseUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) snakeCaseUpdates.last_name = updates.lastName;
    if (updates.email !== undefined) snakeCaseUpdates.email = updates.email;
    if (updates.phone !== undefined) snakeCaseUpdates.phone = updates.phone;

    try {
      const response = await fetch(`${API_URL}/customers/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(snakeCaseUpdates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      saveAuth(data.customer, token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [token, saveAuth]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    setError(null);

    try {
      const response = await fetch(`${API_URL}/customers/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Transform to snake_case for backend API
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password change failed');
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [token]);

  // Get orders
  const getOrders = useCallback(async () => {
    if (!token) {
      return { success: false, error: 'Not authenticated', orders: [] };
    }

    try {
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      return { success: true, orders: data.orders };
    } catch (err) {
      return { success: false, error: err.message, orders: [] };
    }
  }, [token]);

  const value = {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getOrders,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
