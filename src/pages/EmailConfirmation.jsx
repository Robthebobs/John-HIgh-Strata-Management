import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: searchParams.get('token_hash'),
          type: 'email',
        });

        if (error) throw error;

        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setError(error.message);
        setStatus('error');
      }
    };

    if (searchParams.get('token_hash')) {
      verifyEmail();
    } else {
      setStatus('error');
      setError('Invalid confirmation link');
    }
  }, [searchParams, navigate]);

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: searchParams.get('email'),
      });

      if (error) throw error;

      setStatus('resent');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>Email Confirmation</h1>
        </div>
        
        {status === 'verifying' && (
          <div className="success-message">
            Verifying your email...
          </div>
        )}

        {status === 'success' && (
          <div className="success-message">
            Email confirmed successfully! Redirecting to login...
          </div>
        )}

        {status === 'error' && (
          <div className="error-message">
            {error}
            <button 
              onClick={handleResendConfirmation}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Resend Confirmation Email
            </button>
          </div>
        )}

        {status === 'resent' && (
          <div className="success-message">
            Confirmation email has been resent. Please check your inbox.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation; 