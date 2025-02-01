import { Grid, Box } from '@mui/material';
import React from 'react';
import FeatureList from '../components/FeatureList';
import CustomRegistrationForm from '../components/RegistrationFrom';

const RegistrationPage = () => {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          padding: { xs: 2, sm: 4 },
          flexDirection: { xs: 'column', sm: 'row' } // Column on small screens, row on large screens
        }}
      >
        {/* FeatureList - Show on left on large screens, below on small screens */}
        <Grid item xs={12} sm={6} order={{ xs: 2, sm: 1 }}>
          <Box sx={{ height: 'auto', padding: 2 }}>
            <FeatureList />
          </Box>
        </Grid>

        {/* CustomRegistrationForm - Show on right on large screens, above on small screens */}
        <Grid item xs={12} sm={6} order={{ xs: 1, sm: 2 }}>
          <Box sx={{ height: 'auto', padding: 2 }}>
            <CustomRegistrationForm />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default RegistrationPage;
