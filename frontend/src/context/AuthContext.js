import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { authAPI } from '../services/api';
import { normalizeUser } from '../utils/userHelpers';
import { 
  setupAutoLogout, 
  clearAutoLogout, 
  initializeSession,
  clearSession 
} from '../middleware/authMiddleware';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const autoLogoutTimerRef = useRef(null);

  // Helper to setup auto-logout timer
  const setupAutoLogoutTimer = () => {
    if (autoLogoutTimerRef.current) {
      clearAutoLogout(autoLogoutTimerRef.current);
    }
    autoLogoutTimerRef.current = setupAutoLogout(logout);
  };

  // Load user session on mount
  const loadUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const session = await initializeSession();
      
      if (session.authenticated && session.user) {
        const normalizedUser = normalizeUser(session.user);
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        // Setup auto-logout when token expires
        setupAutoLogoutTimer();
        
        return { success: true, user: normalizedUser };
      } else {
        clearSession();
        setUser(null);
        return { success: false, error: 'No valid session found' };
      }
    } catch (err) {
      console.error('Load user error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load user session';
      setError(errorMessage);
      clearSession();
      setUser(null);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    loadUser();
    
    // Cleanup auto-logout timer on unmount
    return () => {
      if (autoLogoutTimerRef.current) {
        clearAutoLogout(autoLogoutTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      const normalizedUser = normalizeUser(user);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      // Setup auto-logout timer
      setupAutoLogoutTimer();

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      const normalizedUser = normalizeUser(user);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      // Update state synchronously
      setUser(normalizedUser);

      // Setup auto-logout timer
      setupAutoLogoutTimer();

      return { success: true, data: response.data, user: normalizedUser };
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    // Clear auto-logout timer
    if (autoLogoutTimerRef.current) {
      clearAutoLogout(autoLogoutTimerRef.current);
      autoLogoutTimerRef.current = null;
    }
    
    clearSession();
    setUser(null);
    setError(null);
  };

  // Update user function
  const updateUser = (userData) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      setError(null);
      const response = await authAPI.getMe();
      const normalizedUser = normalizeUser(response.data.user);
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return { success: true, user: normalizedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to refresh user data';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    isInitialized,
    register,
    login,
    logout,
    updateUser,
    loadUser,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
