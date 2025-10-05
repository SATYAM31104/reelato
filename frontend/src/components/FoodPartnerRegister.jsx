import '../styles/auth.css'
import Shuffle from './Shuffle'
import { useState } from 'react'
import axios from 'axios'

function FoodPartnerRegister() {
  // 🔥 ADD YOUR STATE LOGIC HERE
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phoneNumber: '',
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

  // 🔥 ADD YOUR FORM VALIDATION LOGIC HERE
  const validateForm = () => {
    // TODO: Add validation logic here
    // 1. Check if all required fields are filled
    // 2. Validate email format
    // 3. Validate phone number format
    // 4. Check password strength
    // 5. Set error messages if validation fails
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
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      // API call to register food partner
      const response = await axios.post('http://localhost:3000/api/auth/foodpartner/register', {
        restaurantName: formData.restaurantName,
        ownerName: formData.ownerName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password
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
        phoneNumber: '',
        address: '',
        password: ''
      });
      
    } catch (error) {
      console.log('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
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
              Your food partner account has been created successfully. You can now sign in to start showcasing your delicious food!
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
              name="phoneNumber"
              className="form-input"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
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