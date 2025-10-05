import '../styles/auth.css'
import Shuffle from './Shuffle'
import { useState } from 'react'
import axios from 'axios'

function UserLogin() {
  // 🔥 ADD YOUR STATE LOGIC HERE
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 ADD YOUR INPUT CHANGE LOGIC HERE
  const handleInputChange = (e) => {
    // Update formData state when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    
    // TODO: Implement login logic
    // 1. Set loading to true
    // 2. Clear previous errors
    // 3. Validate form data
    // 4. Make API call to backend
    // 5. Store JWT token in localStorage/cookies
    // 6. Redirect to dashboard on success
    
    console.log('Login submitted:', formData);
    
    // Example API call structure:
    // try {
    //   setLoading(true);
    //   setError('');
    //   
    //   if (!validateForm()) return;
    //   
    //   const response = await axios.post('http://localhost:3000/api/auth/user/login', {
    //     email: formData.email,
    //     password: formData.password
    //   });
    //   
    //   // Store token and redirect
    //   localStorage.setItem('token', response.data.token);
    //   // Navigate to user dashboard
    //   
    // } catch (error) {
    //   setError(error.response?.data?.message || 'Login failed');
    // } finally {
    //   setLoading(false);
    // }
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

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* 🔥 ADD ERROR DISPLAY LOGIC HERE */}
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          
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