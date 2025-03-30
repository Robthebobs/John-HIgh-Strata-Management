import React, { useEffect, useState } from 'react';

const Greeting = () => {
  const [greeting, setGreeting] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await fetch('/api/greeting');
        if (!response.ok) throw new Error('Failed to fetch greeting');
        
        const data = await response.json();
        setGreeting(data.greeting);
        setVisible(true);

        // Hide after 3 seconds
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      } catch (error) {
        console.error('Failed to fetch greeting:', error);
        // Show default greeting on error
        setGreeting('Hello there');
        setVisible(true);
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      }
    };

    fetchGreeting();
  }, []);

  if (!visible) return null;

  return (
    <div className="greeting-popup">
      {greeting}
    </div>
  );
};

export default Greeting; 