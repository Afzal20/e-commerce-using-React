import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const ResetPassword = () => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleResetPassword = () => {
        // Handle reset password logic here
        console.log('Reset password for:', email);
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Typography variant="h4" gutterBottom>
                    Reset Password
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={handleEmailChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleResetPassword}
                >
                    Reset Password
                </Button>
            </Box>
        </Container>
    );
};

export default ResetPassword;