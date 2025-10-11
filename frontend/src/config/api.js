// API Configuration - Works for both local development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reelato-backend.onrender.com'

export { API_BASE_URL }

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  USER_LOGIN: `${API_BASE_URL}/api/auth/user/login`,
  USER_REGISTER: `${API_BASE_URL}/api/auth/user/register`,
  FOODPARTNER_LOGIN: `${API_BASE_URL}/api/auth/foodpartner/login`,
  FOODPARTNER_REGISTER: `${API_BASE_URL}/api/auth/foodpartner/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Food endpoints
  FOOD_LIST: `${API_BASE_URL}/api/food`,
  FOOD_LIKE: `${API_BASE_URL}/api/food/like`,
  FOOD_SAVE: `${API_BASE_URL}/api/food/save`,
  FOOD_COMMENT: `${API_BASE_URL}/api/food/comment`,
  FOOD_COMMENTS: (foodId) => `${API_BASE_URL}/api/food/comments/${foodId}`,
  FOOD_SAVED: `${API_BASE_URL}/api/food/saved`,
  FOOD_SEARCH: `${API_BASE_URL}/api/food/search`,
  FOOD_TRENDING: `${API_BASE_URL}/api/food/trending`,
  FOOD_PARTNER: (partnerId) => `${API_BASE_URL}/api/food/partner/${partnerId}`,
  
  // Test endpoint
  TEST: `${API_BASE_URL}/api/test`
}