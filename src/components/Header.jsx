import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/images/logo.svg" alt="JH Logo" />
        </Link>
      </div>
      
      <nav className="main-nav">
        <Link to="/" className="nav-link active">Home</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </nav>
      
      <div className="auth-buttons">
        <Link to="/login" className="btn btn-login">Login</Link>
        <Link to="/signup" className="btn btn-signup">Sign Up</Link>
      </div>
    </header>
  );
};

export default Header; 