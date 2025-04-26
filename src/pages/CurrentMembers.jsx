import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { clearAuthCookies, isAuthenticated } from '../utils/cookies';

const CurrentMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMemberAlert, setNewMemberAlert] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const userIsAuthenticated = isAuthenticated() || localStorage.getItem('isAuthenticated') === 'true';
    if (!userIsAuthenticated) {
      navigate('/login');
      return;
    }

    // Load members and setup real-time subscription
    const loadMembers = async () => {
      try {
        setLoading(true);
        
        // Fetch all profiles ordered by creation date (order based on sortOrder state)
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, created_at')
          .order('created_at', { ascending: sortOrder === 'asc' });
        
        if (error) {
          throw error;
        }
        
        setMembers(data || []);
      } catch (error) {
        console.error('Error loading members:', error);
        setError('Failed to load members. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Initial load
    loadMembers();
    
    // Setup real-time subscription for new members
    const subscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        (payload) => {
          // Get the new member data
          const newMember = payload.new;
          
          // Add the new member to the state (at beginning or end based on sort order)
          setMembers(prevMembers => {
            const updatedMembers = [...prevMembers];
            if (sortOrder === 'desc') {
              // Add to beginning if sorted newest first
              return [newMember, ...updatedMembers];
            } else {
              // Add to end if sorted oldest first
              return [...updatedMembers, newMember];
            }
          });
          
          // Show an alert about the new member
          setNewMemberAlert(newMember.full_name);
          
          // Clear the alert after 5 seconds
          setTimeout(() => {
            setNewMemberAlert(null);
          }, 5000);
        })
      .subscribe();
    
    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, sortOrder]);
  
  const handleLogout = () => {
    clearAuthCookies();
    navigate('/login');
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="notice-board">
      <div className="notice-header">
        <h1>Current Members</h1>
        <button onClick={handleLogout} className="btn btn-secondary logout-btn">
          Logout
        </button>
      </div>

      {newMemberAlert && (
        <div className="new-member-alert">
          <span className="pulse-dot"></span> 
          New member joined: <strong>{newMemberAlert}</strong>
        </div>
      )}

      <div className="members-section">
        <div className="filter-controls">
          <h2>Registered Users</h2>
          <div className="sort-control">
            <span>Sort by join date:</span>
            <button 
              onClick={toggleSortOrder} 
              className="btn btn-secondary sort-btn"
            >
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              <span className="sort-icon">{sortOrder === 'desc' ? '↓' : '↑'}</span>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-members">
            <p>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="no-members">
            <p>No members have signed up yet.</p>
          </div>
        ) : (
          <div className="members-table-container">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email ID</th>
                  <th>
                    Joined On
                    <button 
                      onClick={toggleSortOrder}
                      className="table-sort-btn"
                      title={sortOrder === 'desc' ? 'Currently showing newest first' : 'Currently showing oldest first'}
                    >
                      {sortOrder === 'desc' ? '↓' : '↑'}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className={newMemberAlert === member.full_name ? 'highlight-row' : ''}>
                    <td>{member.full_name}</td>
                    <td>{member.email}</td>
                    <td>{formatDate(member.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentMembers; 