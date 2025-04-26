import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { isAuthenticated } from '../utils/cookies';

const Header = () => {
  const navigate = useNavigate();
  // Check authentication using cookies with fallback to localStorage
  const userIsAuthenticated = isAuthenticated() || localStorage.getItem('isAuthenticated') === 'true';

  const handleProtectedRoute = (e) => {
    if (!userIsAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="JH Logo" /> 
        </Link>
      </div>
      
      <nav className="main-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Contact
        </NavLink>
        <NavLink 
          to="/notice-board" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          onClick={handleProtectedRoute}
        >
          Requests/Announcements
        </NavLink>
        <NavLink 
          to="/maintenance-requests" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          onClick={handleProtectedRoute}
        >
          My Requests
        </NavLink>
        <NavLink 
          to="/members" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          onClick={handleProtectedRoute}
        >
          Current Members
        </NavLink>
      </nav>
      
      <div className="auth-buttons">
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    </header>
  );
};

export default Header; 