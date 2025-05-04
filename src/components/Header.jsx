import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.svg';
import { isAuthenticated } from '../utils/cookies';
import { supabase } from '../supabaseClient';

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  // Check authentication using cookies with fallback to localStorage
  const userIsAuthenticated = isAuthenticated() || localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userIsAuthenticated) {
        try {
          // Get the current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) throw sessionError;
          
          if (session?.user?.id) {
            const { data, error } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;
            if (data) setUserName(data.full_name);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserName('');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [userIsAuthenticated]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
        {userIsAuthenticated ? (
          <div className="user-info">
            <span className="welcome-text">Welcome, {userName}</span>
            <button onClick={handleLogout} className="btn btn-primary">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header; 