import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Avatar,
  Grid,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch profile data
        const responseProfile = await fetch('http://localhost:8000/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!responseProfile.ok) throw new Error(`Profile fetch error: ${responseProfile.status}`);
        const profileData = await responseProfile.json();
        setProfile(profileData);

        // Fetch orders data
        const responseOrders = await fetch('http://localhost:8000/api/orders/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!responseOrders.ok) throw new Error(`Orders fetch error: ${responseOrders.status}`);
        const ordersData = await responseOrders.json();
        setOrders(ordersData);

        // Fetch user data (assuming API returns an array, but we only want one user)
        const responseUser = await fetch('http://localhost:8000/api/users/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!responseUser.ok) throw new Error(`User fetch error: ${responseUser.status}`);
        const userData = await responseUser.json();
        // Assuming the first item in the array is the current user
        setUser(userData[0] || {});
        
      } catch (error) {
        setError(error.message);
        console.error("An error occurred:", error);
      }
    };
    fetchUserData();
  }, [token]);

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const handleSaveProfile = () => {
    console.log('Profile updated:', profile);
    // Here you would typically make an API call to update the user profile
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, margin: 'auto' }}>{profile.first_name ? profile.first_name[0] : 'U'}</Avatar>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {profile.first_name ? (profile.first_name + (profile.last_name ? ' ' + profile.last_name : '')) : 'User Name Not Found'}
            </Typography>
            <Typography color="textSecondary">{user.email || 'Email Address'}</Typography>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Profile Information</Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {Object.entries(profile).map(([key, value]) => 
                key !== 'user' && key !== 'id' && (
                  <ListItem key={key}>
                    <TextField
                      fullWidth
                      label={key.replace('_', ' ').toUpperCase()}
                      name={key}
                      value={value || ''}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </ListItem>
                )
              )}
            </List>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveProfile}>Save Changes</Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Section */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Order History</Typography>
        <Divider sx={{ my: 2 }} />
        {orders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {orders.map(order => (
              <Grid item xs={12} sm={6} key={order.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="subtitle1">Order ID: {order.id}</Typography>
                    <Typography>Total Price: ${order.total_price}</Typography>
                    <Typography>Payment: {order.payment_method}</Typography>
                    <List>
                      {order.order_items?.map(item => (
                        <ListItem key={item.id}>
                          <ListItemText 
                            primary={`${item.product} - ${item.quantity}x`} 
                            secondary={`Price: $${item.price}, Total: $${item.total_price}`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Logout Button */}
      <Box sx={{ mt: 3 }}>
        <Button 
          startIcon={<LogoutIcon />} 
          variant="outlined" 
          color="error" 
          onClick={handleLogout}
        >
          Logout
        </Button>

        <Button 
          variant="contained" 
          color="primary" 
          sx={{ ml: 2 }}
          onClick={() => window.location.href = '/change/password'}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;