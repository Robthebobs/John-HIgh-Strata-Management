import React, { useEffect, useState } from 'react';

const DebugPage = () => {
  const [envInfo, setEnvInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Check environment variables
      const envData = {
        nodeEnv: process.env.NODE_ENV,
        supabaseUrlDefined: !!process.env.REACT_APP_SUPABASE_URL,
        supabaseKeyDefined: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
        supabaseUrlPrefix: process.env.REACT_APP_SUPABASE_URL 
          ? process.env.REACT_APP_SUPABASE_URL.substring(0, 8) + '...' 
          : 'undefined'
      };
      setEnvInfo(envData);
      
      // Log to console
      console.log('Debug page loaded successfully');
      console.log('Environment info:', envData);
      
    } catch (err) {
      setError(err.toString());
      console.error('Error in debug page:', err);
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: 'sans-serif' 
    }}>
      <h1>Debug Page</h1>
      <p>If you can see this, basic rendering is working correctly.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Environment Variables</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px' 
        }}>
          {JSON.stringify(envInfo, null, 2)}
        </pre>
      </div>
      
      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#ffdddd', 
          border: '1px solid #ff0000',
          borderRadius: '4px'
        }}>
          <h2>Error</h2>
          <pre>{error}</pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h2>Browser Info</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px' 
        }}>
          {JSON.stringify({
            userAgent: navigator.userAgent,
            language: navigator.language,
            windowSize: `${window.innerWidth}x${window.innerHeight}`
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugPage; 