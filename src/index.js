import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Global error boundary to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("React Error Boundary caught an error:", error, errorInfo);
    
    // Optional: Report to an error tracking service here
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          maxWidth: '800px', 
          margin: '40px auto', 
          fontFamily: 'sans-serif',
          backgroundColor: 'white', 
          color: 'black',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#d32f2f' }}>Something went wrong</h1>
          <p>The application encountered an error. Please try refreshing the page.</p>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: '#f5f5f5', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            <h2>Error Details</h2>
            <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>
              {this.state.error?.toString()}
            </p>
            
            <h3>Component Stack</h3>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontSize: '13px',
              color: '#555'
            }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '8px 16px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
            
            <a 
              href="/" 
              style={{
                marginLeft: '10px',
                padding: '8px 16px',
                background: '#f5f5f5',
                color: '#333',
                textDecoration: 'none',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              Go to Homepage
            </a>
          </div>
          
          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />
          
          <div style={{ fontSize: '12px', color: '#777' }}>
            <p>Debug info: React v{React.version}, Build time: {new Date().toISOString()}</p>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Initialize the app with the error boundary
ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
); 