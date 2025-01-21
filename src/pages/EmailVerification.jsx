import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerifyEmail = async () => {
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('access'); // Retrieve the token from local storage
    if (!token) {
      setMessage('Access token not found. Please log in first.');
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ token });

    try {
      await axios.post('http://localhost:8000/dj-rest-auth/token/verify/', body, config);
      setMessage('Email verified successfully! Your account is now activated.');
    } catch (error) {
      console.error('Error during email verification:', error.response?.data || error.message);
      setMessage('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Activate Your Account
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please click the button below to verify your email address and activate your account.
      </Typography>
      {message && (
        <Typography 
          variant="body2" 
          color={message.includes('successfully') ? 'green' : 'error'} 
          style={{ marginTop: '20px' }}
        >
          {message}
        </Typography>
      )}
      <Button
        variant="contained"
        style={{ backgroundColor: '#E7C400', color: '#fff', marginTop: '20px' }}
        onClick={handleVerifyEmail}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </Button>
    </Container>
  );
};

export default EmailVerification;
