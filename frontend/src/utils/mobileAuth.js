// Mobile-friendly authentication utilities
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Check if we're on mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Global auth state management
let globalAuthState = {
  isLoggedIn: false,
  userType: null,
  lastCheck: 0
}

// Initialize auth state from localStorage
const initAuthState = () => {
  const storedAuth = localStorage.getItem('isLoggedIn')
  const storedUserType = localStorage.getItem('userType')
  
  if (storedAuth === 'true' && storedUserType) {
    globalAuthState = {
      isLoggedIn: true,
      userType: storedUserType,
      lastCheck: Date.now()
    }
  }
}

// Get current auth state (mobile-first)
export const getAuthState = () => {
  // Initialize if not done
  if (globalAuthState.lastCheck === 0) {
    initAuthState()
  }
  
  return globalAuthState
}

// Set auth state
export const setAuthState = (isLoggedIn, userType = null) => {
  globalAuthState = {
    isLoggedIn,
    userType,
    lastCheck: Date.now()
  }
  
  if (isLoggedIn) {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userType', userType)
  } else {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userType')
    localStorage.removeItem('authToken')
  }
}

// Create axios instance with mobile auth support
const createAuthenticatedAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 15000
  })

  // Add request interceptor to include token in headers for mobile
  instance.interceptors.request.use(
    (config) => {
      // Always try to get token from localStorage and add to headers
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Add response interceptor for auth errors (less aggressive)
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Only clear auth on explicit authentication failures, not network errors
      if (error.response?.status === 401 && error.response?.data?.message?.includes('Login')) {
        console.log('Authentication failed, clearing auth state')
        setAuthState(false)
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('login') && window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}

// Enhanced login function that stores token for mobile
export const loginWithMobileSupport = async (endpoint, credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials, {
      withCredentials: true
    })

    // If login successful, store auth state
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      const userType = response.data.user ? 'user' : 'foodPartner'
      setAuthState(true, userType)
    }

    return response
  } catch (error) {
    throw error
  }
}

// Enhanced logout function
export const logoutWithMobileSupport = async () => {
  try {
    await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
      withCredentials: true
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear global auth state
    setAuthState(false)
  }
}

export default createAuthenticatedAxios