import axios from 'axios'

// Create axios instance with Render backend URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://reelato-backend.onrender.com',
  withCredentials: true,
  timeout: 15000, // Increased timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
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