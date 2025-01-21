import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

export default function CustomRegistrationForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setFormValues({ ...formValues, [prop]: event.target.value });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8000/dj-rest-auth/registration/', {
        email: formValues.email,
        password1: formValues.password,
        password2: formValues.confirmPassword,
      });
      alert('Registration successful! check your email to verify your account.');
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      alert('Registration failed! Please try again latter.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 4,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        Welcome To Bindu-Britto!
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        Register Now
      </Typography>

      <TextField
        label="Email Address"
        variant="outlined"
        fullWidth
        value={formValues.email}
        onChange={handleChange('email')}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        type={showPassword ? 'text' : 'password'}
        value={formValues.password}
        onChange={handleChange('password')}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
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
        label="Confirm Password"
        variant="outlined"
        fullWidth
        type={showPassword ? 'text' : 'password'}
        value={formValues.confirmPassword}
        onChange={handleChange('confirmPassword')}
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
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
        variant="contained"
        fullWidth
        color="primary"
        sx={{ mb: 2, fontWeight: 'bold', textTransform: 'none' }}
        onClick={handleSignUp}
      >
        Sign Up
      </Button>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Already have an account? Sign in.
        </a>
      </Typography>
    </Box>
  );
}
