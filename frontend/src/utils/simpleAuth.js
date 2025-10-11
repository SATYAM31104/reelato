// Simple, reliable authentication for mobile
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Simple auth state
let authState = {
  isLoggedIn: false,
  userType: null,
  token: null
}

// Initialize from localStorage
const initAuth = () => {
  const token = localStorage.getItem('authToken')
  const userType = localStorage.getItem('userType')
  
  if (token && userType) {
    authState = {
      isLoggedIn: true,
      userType: userType,
      token: token
    }
  }
}

// Get auth state
export const getAuth = () => {
  if (!authState.token) {
    initAuth()
  }
  return authState
}

// Set auth state
export const setAuth = (token, userType) => {
  if (token && userType) {
    authState = {
      isLoggedIn: true,
      userType: userType,
      token: token
    }
    localStorage.setItem('authToken', token)
    localStorage.setItem('userType', userType)
    localStorage.setItem('isLoggedIn', 'true')
  } else {
    authState = {
      isLoggedIn: false,
      userType: null,
      token: null
    }
    localStorage.removeItem('authToken')
    localStorage.removeItem('userType')
    localStorage.removeItem('isLoggedIn')
  }
}

// Create simple axios instance
export const createSimpleAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000
  })

  // Add token to all requests
  instance.interceptors.request.use((config) => {
    const auth = getAuth()
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  })

  return instance
}

// Simple login
export const simpleLogin = async (endpoint, credentials) => {
  const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials)
  
  if (response.data.token) {
    const userType = response.data.user ? 'user' : 'foodPartner'
    setAuth(response.data.token, userType)
  }
  
  return response
}

// Simple logout
export const simpleLogout = () => {
  setAuth(null, null)
  window.location.href = '/'
}

export default createSimpleAxios