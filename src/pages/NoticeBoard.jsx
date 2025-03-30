import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for both development and production
const mockAnnouncements = [
  {
    id: 1,
    title: "System Maintenance",
    content: "Scheduled maintenance this weekend from 2 AM to 4 AM AEST",
    date: "2024-04-20",
    priority: "high"
  },
  {
    id: 2,
    title: "New Feature Release",
    content: "Check out our new dashboard features!",
    date: "2024-04-19",
    priority: "medium"
  },
  {
    id: 3,
    title: "Office Update",
    content: "Sydney office will be having a team building day next Friday",
    date: "2024-04-18",
    priority: "low"
  }
];

const NoticeBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  }, []);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnnouncements(mockAnnouncements);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    alert('Maintenance request submitted successfully!');
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
                  <span className="date">{announcement.date}</span>
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
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoticeBoard; 