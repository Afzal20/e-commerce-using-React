import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerifyEmail = async () => {
    
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
