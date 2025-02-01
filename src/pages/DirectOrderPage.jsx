import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardMedia,
    Stepper,
    Step,
    StepLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    Alert,
    Chip,
    Paper,
    Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaMoneyBillWave } from "react-icons/fa";
import { BaseUrls } from "../env";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const StyledContainer = styled(Container)({
    marginTop: "2rem",
    marginBottom: "2rem",
});

const StyledCard = styled(Card)({
    marginBottom: "1rem",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
    },
});


const OrderProcess = () => {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [orderComplete, setOrderComplete] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem("authToken");
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);


    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        paymentMethod: "bkash",
        transactionId: "",
    });

    const handleChange = (field) => (event) => {
        setFormValues({ ...formValues, [field]: event.target.value });
    };


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${BaseUrls}items/${product_id}/`);
                setProduct(response.data);
            } catch (err) {
                setError("Failed to load product");
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [product_id]);

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            // Skip "Create Account" Step
        }
    }, [token]);

    const steps = isAuthenticated
        ? ["Cart Summary", "Shipping Details", "Payment", "Confirmation"]
        : ["Cart Summary", "Create Account", "Shipping Details", "Payment", "Confirmation"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNext = () => {
        if (activeStep === steps.length - 2) {
            setOrderComplete(true);
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const calculateTotal = () => {
        return product ? product.price + 80 : 0;
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        // Implement login logic here
        console.log("Logging in with", formValues);
    };

    const handleSignUp = () => {
        // Implement sign-up logic here
        if (formValues.password !== formValues.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        console.log("Signing up with", formValues);
    };

    const [loginButtonClicked, setloginButtonClicked] = useState(false);

    const renderCreateAccount = () => (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                {loginButtonClicked ? "Welcome Back!" : "Welcome To Bindu-Britto!"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                {loginButtonClicked ? "Log in to your account" : "Register Now"}
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {loginButtonClicked && (
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" width="20" />}
                    sx={{ mb: 2, textTransform: "none", color: "text.primary", borderColor: "grey.400" }}
                >
                    Log in with Google
                </Button>
            )}

            {loginButtonClicked && <Divider sx={{ my: 2 }}>or</Divider>}

            <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                value={formValues.email}
                onChange={handleChange("email")}
                sx={{ mb: 2 }}
            />

            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                onChange={handleChange("password")}
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

            {!loginButtonClicked && (
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={formValues.confirmPassword}
                    onChange={handleChange("confirmPassword")}
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
            )}

            <Button
                variant="contained"
                fullWidth
                color="primary"
                sx={{ mb: 2, fontWeight: "bold", textTransform: "none" }}
                onClick={loginButtonClicked ? handleLogin : handleSignUp}
            >
                {loginButtonClicked ? "Log In" : "Sign Up"}
            </Button>


            <Button
                variant="text"
                onClick={() => setloginButtonClicked(!loginButtonClicked)}
                sx={{ color: "#1976d2", textTransform: "none", mt: 1 }}
            >
                {loginButtonClicked ? "Don't have an account? Sign up" : "Already have an account? Sign in."}
            </Button>

        </Box>
    );

    const renderCartSummary = () => (
        <Box>
            {loading ? (
                <Typography>Loading product details...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : product ? (
                <StyledCard>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.image || "https://via.placeholder.com/300"}
                                alt={product.title}
                                sx={{ objectFit: "cover" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <CardContent>
                                <Typography variant="h6">{product.title}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Quantity: 1
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {product.price} Taka
                                </Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </StyledCard>
            ) : (
                <Typography color="error">No product found.</Typography>
            )}
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                <Typography variant="h5" gutterBottom>Total: {calculateTotal()} Taka with deliveryCharge</Typography>
            </Paper>
        </Box>
    );

    const renderShippingForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                />
            </Grid>
        </Grid>
    );

    const renderPaymentSection = () => (
        <Box>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                <FormControlLabel value="bkash" control={<Radio />} label="bKash" />
                <FormControlLabel value="nagad" control={<Radio />} label="Nagad" />
                <FormControlLabel value="dutch-bangla" control={<Radio />} label="Dutch-Bangla Bank" />
            </RadioGroup>
            <TextField
                fullWidth
                label="Transaction ID"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                required
            />
        </Box>
    );

    const renderConfirmation = () => (
        <Box>
            {orderComplete && <Alert severity="success">Order successfully placed! Your order number is #12345</Alert>}
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Order Summary</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>Shipping Details:</Typography>
                <Typography color="text.secondary">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}
                </Typography>
                <Typography variant="subtitle1">Payment Method:</Typography>
                <Chip icon={<FaMoneyBillWave />} label={formData.paymentMethod.toUpperCase()} color="primary" />
                <Typography variant="body2" sx={{ mt: 1 }}>Transaction ID: {formData.transactionId}</Typography>
                <Typography variant="h6">Total Amount: {calculateTotal()} Taka</Typography>
            </Paper>
        </Box>
    );

    return (
        <StyledContainer maxWidth="md">
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Paper elevation={3} sx={{ p: 3 }}>
                {/* Call the function to determine what to render */}
                {(() => {
                    switch (activeStep) {
                        case 0:
                            return renderCartSummary();
                        case 1:
                            return isAuthenticated ? renderShippingForm() : renderCreateAccount();
                        case 2:
                            return isAuthenticated ? renderPaymentSection() : renderShippingForm();
                        case 3:
                            return isAuthenticated ? renderConfirmation() : renderPaymentSection();
                        case 4:
                            return renderConfirmation();
                        default:
                            return null;
                    }
                })()}
    
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    {activeStep !== 0 && (
                        <Button onClick={handleBack} sx={{ mr: 1 }} variant="outlined">
                            Back
                        </Button>
                    )}
                    {activeStep < steps.length - 1 && (
                        <Button variant="contained" onClick={handleNext} color="primary">
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>
        </StyledContainer>
    );    
};

export default OrderProcess;
