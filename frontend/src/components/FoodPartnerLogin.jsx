import '../styles/auth.css'
import Shuffle from './Shuffle'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

function FoodPartnerLogin() {
  const navigate = useNavigate();

  // 🔥 STATE MANAGEMENT
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [partnerData, setPartnerData] = useState(null);

  // 🔥 INPUT CHANGE HANDLER
  const handleInputChange = (e) => {
    // Update formData state when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear success message and errors if user starts typing again
    if (success) {
      setSuccess(false);
    }
    if (error) {
      setError('');
    }
  };

  // 🔥 FORM VALIDATION LOGIC
  const validateForm = () => {
    // Check if email and password are provided
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check password length (basic check)
    if (formData.password.length < 1) {
      setError('Password is required');
      return false;
    }

    return true;
  };

  // 🔥 FORM SUBMISSION HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      // Validate form data
      if (!validateForm()) {
        return;
      }

      // API call to login food partner
      const response = await axios.post(`${API_BASE_URL}/api/auth/foodpartner/login`, {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      console.log('Food Partner login successful:', response.data);

      // Set success state and partner data
      setSuccess(true);
      setPartnerData(response.data.foodPartner);

      // Clear form
      setFormData({
        email: '',
        password: ''
      });

      // Redirect to general feed page after 1 second
      setTimeout(() => {
        navigate("/create-food");
      }, 1000);

    } catch (error) {
      console.error('Food Partner login error:', error);
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
            shuffleDirection="down"
            triggerOnHover={true}
          />
          <p className="auth-subtitle">Access your ReelBites partner dashboard</p>
        </div>

        {/* 🎉 SUCCESS MESSAGE */}
        {success && (
          <div style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽️</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
              Welcome back, {partnerData?.restaurantName || 'Partner'}!
            </h3>
            <p style={{ margin: '0', opacity: '0.9' }}>
              Login successful! Redirecting you to the food creation dashboard where you can start adding your delicious creations...
            </p>
            {partnerData && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: '0.8' }}>
                Owner: {partnerData.ownerName}
              </div>
            )}
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
              placeholder="Enter your business email"
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

          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <p>💡 <strong>Tip:</strong> Use the same email and password you used during registration</p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span>🔄</span> Signing In...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span>🍽️</span> Sign In to Dashboard
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            New partner? <a href="/food-partner/register" className="auth-link">Register here</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FoodPartnerLogin