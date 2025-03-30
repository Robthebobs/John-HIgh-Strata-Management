import React, { useState } from 'react';

const NoticeBoard = () => {
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

  return (
    <div className="main-content">
      <div className="notice-board">
        <h1 className="page-title">Requests/Announcements</h1>
        <div className="notices">
          {/* Add your notices here */}
          <p>Coming soon... Notice board content will be added here.</p>
        </div>

        <div className="maintenance-section">
          <h2 className="section-title">Maintenance Request</h2>
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
    </div>
  );
};

export default NoticeBoard; 