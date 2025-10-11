// Ultra-simple, reliable authentication
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Global auth state - simple and reliable
window.authState = {
  isLoggedIn: false,
  userType: null,
  token: null
}

// Initialize from localStorage on page load
const initAuth = () => {
  try {
    const token = localStorage.getItem('authToken')
    const userType = localStorage.getItem('userType')
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    if (token && userType && isLoggedIn === 'true') {
      window.authState = {
        isLoggedIn: true,
        userType: userType,
        token: token
      }
    }
  } catch (error) {
    console.log('Auth init error:', error)
  }
}

// Call init immediately
initAuth()

// Get current auth state
export const isAuthenticated = () => {
  // Always check localStorage as well for reliability
  const storedAuth = localStorage.getItem('isLoggedIn')
  const storedToken = localStorage.getItem('authToken')
  
  if (storedAuth === 'true' && storedToken && !window.authState.isLoggedIn) {
    // Restore auth state from localStorage
    initAuth()
  }
  
  return window.authState.isLoggedIn
}

export const getUserType = () => {
  // Always check localStorage as well for reliability
  const storedUserType = localStorage.getItem('userType')
  
  if (storedUserType && !window.authState.userType) {
    // Restore auth state from localStorage
    initAuth()
  }
  
  return window.authState.userType
}

export const getToken = () => {
  // Always check localStorage as well for reliability
  const storedToken = localStorage.getItem('authToken')
  
  if (storedToken && !window.authState.token) {
    // Restore auth state from localStorage
    initAuth()
  }
  
  return window.authState.token
}

// Set auth state
export const setAuthState = (isLoggedIn, userType = null, token = null) => {
  window.authState = {
    isLoggedIn: isLoggedIn,
    userType: userType,
    token: token
  }
  
  if (isLoggedIn && token && userType) {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userType', userType)
    localStorage.setItem('isLoggedIn', 'true')
  } else {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userType')
    localStorage.removeItem('isLoggedIn')
  }
}

// Create axios instance with auth
export const createAuthAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Keep cookies for web
    timeout: 15000
  })

  // Add token header if available
  instance.interceptors.request.use((config) => {
    if (window.authState.token) {
      config.headers.Authorization = `Bearer ${window.authState.token}`
    }
    return config
  })

  return instance
}

// Simple login function
export const login = async (endpoint, credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials, {
      withCredentials: true
    })
    
    if (response.data.token) {
      // Determine user type based on response structure
      const userType = response.data.user ? 'user' : 'foodPartner'
      setAuthState(true, userType, response.data.token)
      
      console.log('Login successful - Auth state set:', {
        isLoggedIn: true,
        userType: userType,
        hasToken: !!response.data.token
      })
    }
    
    return response
  } catch (error) {
    throw error
  }
}

// Verify authentication with backend
export const verifyAuth = async () => {
  try {
    const authAxios = createAuthAxios()
    const response = await authAxios.get('/api/auth/me')
    
    if (response.data) {
      const userType = response.data.type
      const userData = response.data.user || response.data.foodPartner
      
      // Update auth state with verified data
      setAuthState(true, userType, getToken())
      
      console.log('Auth verification successful:', {
        userType: userType,
        userData: userData
      })
      
      return true
    }
  } catch (error) {
    console.log('Auth verification failed:', error.response?.status)
    
    // If 401, clear auth state
    if (error.response?.status === 401) {
      setAuthState(false)
    }
    
    return false
  }
}

// Simple logout function
export const logout = () => {
  setAuthState(false)
  window.location.href = '/'
}

export default createAuthAxios