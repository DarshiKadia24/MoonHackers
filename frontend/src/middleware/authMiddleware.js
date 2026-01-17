import { authAPI } from '../services/api';

/**
 * SIMPLIFIED Auth Middleware (Hackathon Mode)
 * Token expiration & auto-logout DISABLED for development
 */

// Validate token with backend (simple check)
export const validateToken = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return { valid: false };
  }

  try {
    const response = await authAPI.getMe();
    return { valid: true, user: response.data.user };
  } catch {
    return { valid: false };
  }
};

// Disabled expiration logic
export const isTokenExpired = () => false;
export const getTokenExpirationTime = () => 0;
export const setupAutoLogout = () => null;
export const clearAutoLogout = () => {};

// Session restore
export const shouldRestoreSession = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Clear session
export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Initialize session
export const initializeSession = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    clearSession();
    return { authenticated: false };
  }

  const validation = await validateToken();

  if (!validation.valid) {
    clearSession();
    return { authenticated: false };
  }

  return {
    authenticated: true,
    user: validation.user,
  };
};

const authMiddleware = {
  validateToken,
  isTokenExpired,
  getTokenExpirationTime,
  setupAutoLogout,
  clearAutoLogout,
  shouldRestoreSession,
  clearSession,
  initializeSession,
};

export default authMiddleware;