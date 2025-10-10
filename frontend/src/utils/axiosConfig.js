import axios from 'axios'

// Create axios instance with default config
const axiosInstance = axios.create({
  withCredentials: true,
  timeout: 10000
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