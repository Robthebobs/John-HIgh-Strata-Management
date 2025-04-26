import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { clearAuthCookies, getUserId } from '../utils/cookies';

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user's maintenance requests
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Get user ID from cookies (with fallback to localStorage)
      const userId = getUserId() || localStorage.getItem('userId');
      
      // Don't use anonymous ID - strict check for user ID
      if (!userId) {
        // Instead of showing shared anonymous requests, show no requests
        setRequests([]);
        return;
      }
      
      // Fetch maintenance requests for the current user's exact ID
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading maintenance requests:', error);
      setError('Failed to load your maintenance requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    clearAuthCookies();
    navigate('/login');
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (time) => {
    switch(time) {
      case 'morning':
        return 'Morning (9AM - 12PM)';
      case 'afternoon':
        return 'Afternoon (12PM - 5PM)';
      case 'evening':
        return 'Evening (5PM - 8PM)';
      default:
        return time;
    }
  };
  
  const formatRequestType = (type) => {
    if (!type) return 'N/A';
    
    // Capitalize first letter
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-badge status-pending';
      case 'in progress':
      case 'in-progress':
        return 'status-badge status-progress';
      case 'completed':
        return 'status-badge status-completed';
      case 'canceled':
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="notice-board">
      <div className="notice-header">
        <h1>My Maintenance Requests</h1>
        <button onClick={handleLogout} className="btn btn-secondary logout-btn">
          Logout
        </button>
      </div>

      <div className="maintenance-requests-section">
        <h2>Your Submitted Requests</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-requests">
            <p>Loading your maintenance requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="no-requests">
            <p>You haven't submitted any maintenance requests yet.</p>
            <button 
              onClick={() => navigate('/notice-board')}
              className="btn btn-primary"
            >
              Submit a Request
            </button>
          </div>
        ) : (
          <div className="requests-container">
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{formatRequestType(request.requestType)}</h3>
                  <span className={getStatusBadgeClass(request.status)}>
                    {request.status || 'Pending'}
                  </span>
                </div>
                
                <div className="request-details">
                  <div className="detail-row">
                    <span className="detail-label">Submitted On:</span>
                    <span className="detail-value">{formatDate(request.created_at)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Unit Number:</span>
                    <span className="detail-value">{request.unit}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Preferred Date:</span>
                    <span className="detail-value">{formatDate(request.preferredDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Preferred Time:</span>
                    <span className="detail-value">{formatTime(request.preferredTime)}</span>
                  </div>
                  <div className="detail-row full-width">
                    <span className="detail-label">Description:</span>
                    <p className="detail-value description-text">{request.description}</p>
                  </div>
                  
                  {request.adminNotes && (
                    <div className="detail-row full-width admin-notes">
                      <span className="detail-label">Admin Notes:</span>
                      <p className="detail-value">{request.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequests; 