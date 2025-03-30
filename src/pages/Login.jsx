import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const validUserId = process.env.REACT_APP_VALID_USER_ID;
    const validPassword = process.env.REACT_APP_VALID_PASSWORD;

    if (userId === validUserId && password === validPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/notice-board');
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  const handleContactAdmin = (e) => {
    e.preventDefault();
    navigate('/admin-contact');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <img src={logo} alt="JH Logo" className="login-logo" />
          <h1>Welcome Back!!</h1>
          <p>Please enter your details</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-links">
            <a href="#" className="forgot-password">Forgot Password</a>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          
          <div className="login-footer">
            <p>Do not have your login details? <a href="#" onClick={handleContactAdmin} className="help-link">Contact admin</a></p>
          </div>
        </form>
      </div>
      <div className="login-image">
        {/* This will be the decorative image */}
      </div>
    </div>
  );
};

export default Login; 