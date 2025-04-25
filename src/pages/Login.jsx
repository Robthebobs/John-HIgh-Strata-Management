import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      localStorage.setItem('isAuthenticated', 'true');
      navigate('/notice-board');
    } catch (error) {
      setError(error.error_description || error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/404', {
        method: 'GET',
      });
      
      if (response.status === 404) {
        navigate('/admin-contact');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/admin-contact');
    }
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
            <Link to="/404" className="forgot-password">Forgot Password</Link>
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
            <p>Don't have an account? <Link to="/signup" className="help-link">Sign up</Link></p>
            <p>Do not have your login details? <Link to="/404" className="help-link">Contact admin</Link></p>
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