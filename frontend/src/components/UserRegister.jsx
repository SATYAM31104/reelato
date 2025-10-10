import '../styles/auth.css'
import Shuffle from './Shuffle'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function UserRegister() {

  const navigate = useNavigate();
  // 🔥 ADD YOUR STATE LOGIC HERE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

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
    // Check if all fields are filled
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    // Check password strength (min 6 chars)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    // Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  // 🔥 ADD YOUR API CALL LOGIC HERE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      // Validate form
      if (!validateForm()) {
        return;
      }

      // Correct API endpoint for your backend
      const response = await axios.post('http://localhost:3000/api/auth/user/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      console.log('Registration successful:', response.data);

      // Set success state and user data
      setSuccess(true);
      setUserData(response.data.user);

      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to general feed page after 2 seconds to show success message
      setTimeout(() => {
        navigate("/general");
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);

      if (error.response) {
        // Server responded with error status
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Something else happened
        setError('Registration failed. Please try again.');
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
            shuffleDirection="up"
            duration={0.4}
            animationMode="evenodd"
            ease="power3.out"
            stagger={0.04}
            triggerOnHover={true}
          />
          <p className="auth-subtitle">Join ReelBites to discover amazing food videos</p>
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
              Welcome to ReelBites, {userData?.name}!
            </h3>
            <p style={{ margin: '0', opacity: '0.9' }}>
              Your account has been created successfully. Redirecting you to the food feed to start discovering amazing videos!
            </p>
            <div style={{ marginTop: '1rem' }}>
              <a
                href="/user/login"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                Sign In Now →
              </a>
            </div>
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {/* 🔥 ADD LOADING STATE LOGIC HERE */}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account? <a href="/user/login" className="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserRegister