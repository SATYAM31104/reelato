import '../styles/auth.css'
import Shuffle from './Shuffle'
import { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'

function UserLogin() {
  const navigate = useNavigate();

  // 🔥 ADD YOUR STATE LOGIC HERE
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 🔥 ADD YOUR INPUT CHANGE LOGIC HERE
  const handleInputChange = (e) => {
    // Update formData state when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear success message if user starts typing again
    if (success) {
      setSuccess(false);
    }
  };

  // 🔥 ADD YOUR FORM VALIDATION LOGIC HERE
  const validateForm = () => {
    // TODO: Add validation logic here
    // 1. Check if email and password are provided
    // 2. Validate email format
    // 3. Set error messages if validation fails
    return true;
  };

  // 🔥 ADD YOUR API CALL LOGIC HERE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      // API call to login user
      const response = await axiosInstance.post('/api/auth/user/login', {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      console.log('Login successful:', response.data);

      // Set success state
      setSuccess(true);

      // Clear form
      setFormData({
        email: '',
        password: ''
      });

      // Redirect to feed page after 1 second
      setTimeout(() => {
        navigate("/feed");
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);

      if (error.response) {
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        setError('No response from server. Please check if the backend is running.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header-with-shuffle">
          <Shuffle
            text="ReelBites"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
          />
          <p className="auth-subtitle">Sign in to your ReelBites account</p>
        </div>

        {/* 🎉 SUCCESS MESSAGE */}
        {success && (
          <div style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
              Welcome back to ReelBites!
            </h3>
            <p style={{ margin: '0', opacity: '0.9' }}>
              Login successful! Redirecting you to the food feed...
            </p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* 🔥 ERROR DISPLAY */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {/* 🔥 ADD LOADING STATE LOGIC HERE */}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account? <a href="/user/register" className="auth-link">Create one</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLogin