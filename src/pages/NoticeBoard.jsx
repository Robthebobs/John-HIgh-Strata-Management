import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { clearAuthCookies } from '../utils/cookies';

const NoticeBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newAnnouncementAlert, setNewAnnouncementAlert] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    phone: '',
    email: '',
    requestType: 'repair',
    description: '',
    preferredDate: '',
    preferredTime: 'morning'
  });

  useEffect(() => {
    loadAnnouncements();
    
    // Subscribe to real-time updates for announcements
    const subscription = supabase
      .channel('announcements-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'announcements' 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Show alert for new announcement
            setNewAnnouncementAlert(payload.new.title);
            setTimeout(() => setNewAnnouncementAlert(null), 5000);
          }
          // Reload announcements to get the latest data
          loadAnnouncements();
        })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error loading announcements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthCookies();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Get the current user ID from localStorage
      let userId = localStorage.getItem('userId');
      
      // If no user ID or the value isn't a UUID, use a default UUID for anonymous users
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        userId = '00000000-0000-0000-0000-000000000000';
      }
      
      // Generate a unique ID for this request to avoid primary key conflicts
      const uniqueId = crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      
      // Add submission timestamp, user ID, and unique ID
      const maintenanceRequest = {
        id: uniqueId,
        ...formData,
        user_id: userId,
        created_at: new Date().toISOString(),
        status: 'pending' // Initial status
      };

      // Insert maintenance request into Supabase
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([maintenanceRequest]);

      if (error) {
        throw error;
      }

      // Show success message
      setSubmitSuccess(true);
      console.log('Maintenance request saved:', data);
      
      // Reset form
      setFormData({
        name: '',
        unit: '',
        phone: '',
        email: '',
        requestType: 'repair',
        description: '',
        preferredDate: '',
        preferredTime: 'morning'
      });
    } catch (error) {
      console.error('Error saving maintenance request:', error);
      setSubmitError(error.message || 'Failed to submit maintenance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <div className="notice-board loading">
        <div className="loading-spinner">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="notice-board">
      <div className="notice-header">
        <h1>Notice Board</h1>
        <button onClick={handleLogout} className="btn btn-secondary logout-btn">
          Logout
        </button>
      </div>

      {newAnnouncementAlert && (
        <div className="new-announcement-alert">
          <span className="pulse-dot"></span> 
          New announcement: <strong>{newAnnouncementAlert}</strong>
        </div>
      )}

      <div className="announcements-section">
        <h2>Announcements</h2>
        <div className="announcements">
          {announcements.length === 0 ? (
            <p className="no-announcements">No announcements to display.</p>
          ) : (
            announcements.map(announcement => (
              <div 
                key={announcement.id} 
                className="announcement-card"
                style={{ borderLeft: `4px solid ${getPriorityColor(announcement.priority)}` }}
              >
                <div className="announcement-header">
                  <h2>{announcement.title}</h2>
                  <span className="date">{new Date(announcement.created_at).toLocaleDateString()}</span>
                </div>
                <p className="content">{announcement.content}</p>
                <div className="priority-tag" style={{ color: getPriorityColor(announcement.priority) }}>
                  {announcement.priority.toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="maintenance-section">
        <h2>Maintenance Request</h2>
        <div className="section-header">
          <p>Submit a new maintenance request below or view your previous requests.</p>
          <button 
            onClick={() => navigate('/maintenance-requests')} 
            className="btn btn-secondary view-requests-btn"
          >
            View My Requests
          </button>
        </div>
        
        {submitSuccess && (
          <div className="success-message">
            Maintenance request submitted successfully!
          </div>
        )}
        {submitError && (
          <div className="error-message">
            {submitError}
          </div>
        )}
        <form className="maintenance-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit">Unit Number</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="requestType">Request Type</label>
              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="repair">Repair</option>
                <option value="replacement">Replacement</option>
                <option value="inspection">Inspection</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="preferredDate">Preferred Date</label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="preferredTime">Preferred Time</label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value="morning">Morning (9AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 5PM)</option>
              <option value="evening">Evening (5PM - 8PM)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description of Issue</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoticeBoard; 