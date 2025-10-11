// Mobile-friendly authentication utilities
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Check if we're on mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
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
      // If mobile, try to get token from localStorage and add to headers
      if (isMobile()) {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Add response interceptor for auth errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear auth state
        localStorage.removeItem('authToken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userType')
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/') {
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

    // If login successful and we have a token, store it for mobile
    if (response.data.token && isMobile()) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userType', response.data.user ? 'user' : 'foodPartner')
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
    // Always clear local storage
    localStorage.removeItem('authToken')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userType')
  }
}

export default createAuthenticatedAxios