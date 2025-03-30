const Footer = () => {
  return (
    <footer className="footer">
      <div className="contact-info">
        <h3>Contact Information:</h3>
        <p>📍 Address: 123 Strata Lane, Sydney, NSW</p>
        <p>📞 Phone: (02) 1234 5678</p>
        <p>📧 Email: admin@johnhighstrata.com</p>
      </div>
      <div className="copyright">
        <p>© {new Date().getFullYear()} John High Strata. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 