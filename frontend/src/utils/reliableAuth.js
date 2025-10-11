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
  return window.authState.isLoggedIn
}

export const getUserType = () => {
  return window.authState.userType
}

export const getToken = () => {
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
      const userType = response.data.user ? 'user' : 'foodPartner'
      setAuthState(true, userType, response.data.token)
    }
    
    return response
  } catch (error) {
    throw error
  }
}

// Simple logout function
export const logout = () => {
  setAuthState(false)
  window.location.href = '/'
}

export default createAuthAxios