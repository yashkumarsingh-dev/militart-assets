// Authentication utilities

const TOKEN_KEY = "kristalball_token";
const USER_KEY = "kristalball_user";

export const authUtils = {
  // Store authentication token
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get authentication token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove authentication token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Store user data
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Remove user data
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authUtils.getToken();
  },

  // Clear all authentication data
  clearAuth: () => {
    authUtils.removeToken();
    authUtils.removeUser();
  },

  // Get authorization header for API requests
  getAuthHeader: () => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authUtils;
