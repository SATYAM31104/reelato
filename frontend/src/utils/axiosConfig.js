import axios from 'axios'

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reelato-backend.onrender.com'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000 // Increased for Render cold starts
})

// Response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state from localStorage
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

export default axiosInstance