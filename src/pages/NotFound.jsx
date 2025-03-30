import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <img src={logo} alt="JH Logo" className="error-logo" />
        <h1>404 - Page Not Found</h1>
        <div className="error-message">
          <p className="large-text">Oops! Something's not right.</p>
          <p>The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="error-actions">
          <button onClick={handleGoBack} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 