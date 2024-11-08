import { Grid, Box } from '@mui/material';
import React from 'react'
import Login from '../components/Login'
import FeatureList from '../components/FeatureList'
import Navbar from '../components/Navbar'

const LoginPage = () => {
  return (
    <>
    <Navbar/>
      <div>
        <Grid container spacing={2} sx={{ padding: { xs: 2, sm: 4 } }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 'auto', padding: 2 }}>
              <Login />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ height: 'auto', padding: 2 }}>
              < FeatureList />
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default LoginPage


