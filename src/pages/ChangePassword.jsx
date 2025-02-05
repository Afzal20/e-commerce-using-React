import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert 
} from '@mui/material';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const ChangePasswordPage = () => {
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Retrieve JWT token from localStorage or wherever you store it
    const jwtToken = localStorage.getItem('authToken');

    try {
      const response = await axios.post(
        'http://localhost:8000/dj-rest-auth/password/change/', 
        {
          new_password1: newPassword1,
          new_password2: newPassword2
        },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.status === 200) {
        setSuccess(true);
        setError(null);
        setNewPassword1(''); // Clear the fields
        setNewPassword2('');
      }
    } catch (error) {
      setError(error.response?.data?.new_password2 || 'An error occurred');
      setSuccess(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Paper elevation={3} sx={{ p: 3, width: '300px' }}>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        {success && 
          <Alert severity="success" sx={{ mb: 2 }}>Password changed successfully!</Alert>
        }
        {error && 
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        }
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePasswordPage;