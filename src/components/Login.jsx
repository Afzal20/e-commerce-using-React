import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function CustomLoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    email: '',
    password: '',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setFormValues({ ...formValues, [prop]: event.target.value });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Login form submitted:', formValues);
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
        Welcome Back!
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        Log in to your account
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" width="20" />}
        sx={{
          mb: 2,
          textTransform: 'none',
          color: 'text.primary',
          borderColor: 'grey.400',
        }}
      >
        Log in with Google
      </Button>

      <Divider sx={{ my: 2 }}>or</Divider>

      <TextField
        label="Email address"
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
        onClick={handleLogin}
      >
        Log In
      </Button>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>Forgot your password?</a>
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        <a href="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Don't have an account? Sign up
        </a>
      </Typography>
    </Box>
  );
}
