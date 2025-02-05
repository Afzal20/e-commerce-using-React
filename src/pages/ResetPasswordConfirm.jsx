import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { TextField, Button, Alert, Box, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/dj-rest-auth/password/reset/confirm/`,
        {
          uid: uid,
          token: token,
          new_password1: newPassword1,
          new_password2: newPassword2
        }
      );
      setMessage('Password has been reset successfully.');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.non_field_errors || 'An error occurred while resetting your password.');
      setMessage('');
    }
  };

  return (
    <>
      <Box sx={{ height: '20px' }} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', margin: 'auto' }}>
        <TextField
          label="New Password"
          variant="outlined"
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={newPassword1}
          onChange={(e) => setNewPassword1(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </form>
      <Box sx={{ height: '20px' }} />
    </>
  );
};

export default ResetPasswordConfirm;