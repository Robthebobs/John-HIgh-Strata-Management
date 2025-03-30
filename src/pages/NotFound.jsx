import React from 'react';
import logo from '../assets/logo.svg';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="logo-container">
          <img src={logo} alt="JH Logo" className="not-found-logo" />
        </div>
        <h1 className="not-found-text">Page not found!!!</h1>
      </div>
    </div>
  );
};

export default NotFound; 