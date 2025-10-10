import '../styles/auth.css'
import Shuffle from './Shuffle'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function FoodPartnerRegister() {
  const navigate = useNavigate();
  // 🔥 ADD YOUR STATE LOGIC HERE
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [partnerData, setPartnerData] = useState(null);

  // 🔥 ADD YOUR INPUT CHANGE LOGIC HERE
  const handleInputChange = (e) => {
    // Update formData state when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear success message if user starts typing again
    if (success) {
      setSuccess(false);
    }
  };

  // 🔥 FORM VALIDATION LOGIC
  const validateForm = () => {
    // Check if all required fields are filled
    if (!formData.restaurantName || !formData.ownerName || !formData.email || !formData.phone || !formData.address || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate phone number (basic check)
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number (minimum 10 digits)');
      return false;
    }

    // Check password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    // Validate restaurant name length
    if (formData.restaurantName.length < 2) {
      setError('Restaurant name must be at least 2 characters');
      return false;
    }

    // Validate owner name length
    if (formData.ownerName.length < 2) {
      setError('Owner name must be at least 2 characters');
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

      // Validate form data
      if (!validateForm()) {
        return;
      }

      // API call to register food partner
      const response = await axios.post('http://localhost:3000/api/auth/foodpartner/register', {
        restaurantName: formData.restaurantName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone, // Fixed field name
        address: formData.address,
        password: formData.password
      }, {
        withCredentials: true // This ensures cookies are sent and received
      });

      console.log('Food Partner registration successful:', response.data);

      // Set success state and partner data
      setSuccess(true);
      setPartnerData(response.data.foodPartner);

      // Clear form
      setFormData({
        restaurantName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
      });

      // Redirect to create food page after 2 seconds to show success message
      setTimeout(() => {
        navigate("/create-food");
      }, 2000);

    } catch (error) {
      console.error('Food Partner registration error:', error);
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
            shuffleDirection="left"
            triggerOnHover={true}
          />
          <p className="auth-subtitle">Start showcasing your delicious food on ReelBites</p>
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
              Welcome to ReelBites, {partnerData?.restaurantName}!
            </h3>
            <p style={{ margin: '0', opacity: '0.9' }}>
              Your food partner account has been created successfully. Redirecting you to the food creation dashboard to start adding your delicious food!
            </p>
            <div style={{ marginTop: '1rem' }}>
              <a
                href="/food-partner/login"
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
                Sign In to Dashboard →
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
            <label className="form-label">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              className="form-input"
              placeholder="Enter restaurant name"
              value={formData.restaurantName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              className="form-input"
              placeholder="Enter owner's full name"
              value={formData.ownerName}
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
              placeholder="Enter business email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Enter phone number (e.g., +1234567890)"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Enter restaurant address"
              value={formData.address}
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {/* 🔥 ADD LOADING STATE LOGIC HERE */}
            {loading ? 'Registering...' : 'Register as Partner'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already a partner? <a href="/food-partner/login" className="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FoodPartnerRegister