import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Alert, Box } from "@mui/material";


const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/dj-rest-auth/password/reset/',
        { email }
      );
      setMessage('An email has been sent to reset your password.');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while sending reset email.');
      setMessage('');
    }
  };

  return (
    <><Box sx={{ height: '20px' }}/>
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Enter your email"
        variant="outlined"
        fullWidth
        required
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Reset Password
      </Button>
      {message && <Alert severity="success" style={{ marginTop: '20px' }}>{message}</Alert>}
      {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
    </form>
    <Box sx={{ height: '20px' }}/>
    </>
  );
};

export default PasswordResetRequest;