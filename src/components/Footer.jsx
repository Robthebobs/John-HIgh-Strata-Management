import { Link } from 'react-router-dom';

const Footer = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const faqUrl = isDevelopment ? 'http://localhost:8000/faq.php' : '/api/faq.php';

  return (
    <footer className="footer">
      <div className="contact-info">
        <h3>Contact Information:</h3>
        <p>📍 Address: 123 Strata Lane, Sydney, NSW</p>
        <p>📞 Phone: (02) 1234 5678</p>
        <p>📧 Email: admin@johnhighstrata.com</p>
      </div>
      <div className="footer-links">
        <a href={faqUrl} className="footer-link" target="_blank" rel="noopener noreferrer">FAQ</a>
      </div>
      <div className="copyright">
        <p>© {new Date().getFullYear()} John High Strata. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 