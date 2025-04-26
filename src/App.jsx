import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NoticeBoard from './pages/NoticeBoard';
import CurrentMembers from './pages/CurrentMembers';
import MaintenanceRequests from './pages/MaintenanceRequests';
import DebugPage from './pages/DebugPage';
import NotFound from './pages/NotFound';
import { isAuthenticated } from './utils/cookies';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  // Check authentication using cookies (with fallback to localStorage for compatibility)
  const userIsAuthenticated = isAuthenticated() || localStorage.getItem('isAuthenticated') === 'true';
  return userIsAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    // Log basic app initialization info
    console.log('App initialized, React version:', React.version);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Check if we're in the Vercel production environment
    if (window.location.hostname.includes('vercel.app')) {
      console.log('Running on Vercel deployment');
    }
  }, []);

  // If there's a catastrophic error, show it instead of a blank screen
  if (appError) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>App Error</h1>
        <pre style={{ background: '#ffeeee', padding: '15px', borderRadius: '4px' }}>
          {appError.toString()}
        </pre>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/notice-board" 
            element={
              <ProtectedRoute>
                <NoticeBoard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/members" 
            element={
              <ProtectedRoute>
                <CurrentMembers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/maintenance-requests" 
            element={
              <ProtectedRoute>
                <MaintenanceRequests />
              </ProtectedRoute>
            } 
          />
          {/* Debug route to help diagnose Vercel issues */}
          <Route path="/debug" element={<DebugPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 