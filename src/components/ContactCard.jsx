import React from 'react';
import PropTypes from 'prop-types';

const ContactCard = ({ image, name, position, phone, email }) => {
  return (
    <div className="contact-card">
      <div className="contact-image">
        <img src={image} alt={name} />
      </div>
      <div className="contact-info">
        <h2>{name}</h2>
        <div className="contact-details">
          <p className="position"><i className="fas fa-user-tie"></i> {position}</p>
          <p className="phone"><i className="fas fa-phone"></i> {phone}</p>
          <p className="email"><i className="fas fa-envelope"></i> {email}</p>
        </div>
      </div>
    </div>
  );
};

ContactCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

export default ContactCard; 