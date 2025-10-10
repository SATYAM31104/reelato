// API Configuration - Now using centralized axios instance
// Just define endpoint paths, baseURL is handled by axiosInstance

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_ME: '/api/auth/me',
  USER_LOGIN: '/api/auth/user/login',
  USER_REGISTER: '/api/auth/user/register',
  FOODPARTNER_LOGIN: '/api/auth/foodpartner/login',
  FOODPARTNER_REGISTER: '/api/auth/foodpartner/register',
  LOGOUT: '/api/auth/logout',
  
  // Food endpoints
  FOOD_LIST: '/api/food',
  FOOD_LIKE: '/api/food/like',
  FOOD_SAVE: '/api/food/save',
  FOOD_COMMENT: '/api/food/comment',
  FOOD_COMMENTS: (foodId) => `/api/food/comments/${foodId}`,
  FOOD_SAVED: '/api/food/saved',
  FOOD_SEARCH: '/api/food/search',
  FOOD_TRENDING: '/api/food/trending',
  FOOD_PARTNER: (partnerId) => `/api/food/partner/${partnerId}`,
  
  // Test endpoint
  TEST: '/api/test'
}