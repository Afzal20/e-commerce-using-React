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
    const { product_id, color, quantity, size } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0);  
    const [orderComplete, setOrderComplete] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem("authToken");
    const isPaymentStep = isAuthenticated ? activeStep === 2 : activeStep === 3;
    const isCreateAccountStep = isAuthenticated ? false : (activeStep === 1);
    const [formErrors] = useState({});

    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    products: [],
    firstName: "",
    lastName: "",
    Phone: "",
    District: "",
    Upozila: "",
    city: "",
    address: "",
    paymentMethod: "",
    senderAccountNumber: "",
    transactionId: "",
  });

    const handleChange = (field) => (event) => {
        setFormValues({ ...formValues, [field]: event.target.value });
    };


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${BaseUrls}api/items/${product_id}/`);
                setProduct(response.data);
                console.log("Product fetched:", response.data);
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

      // Function to decode JWT and extract user info
  function getUserFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return { id: payload.user_id || null, username: payload.username || null }; // Adjust based on backend token structure
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

  async function submitOrder() {
    const authToken = localStorage.getItem("authToken");
    const user = authToken ? getUserFromToken(authToken) : null;

    const orderData = {
        user: user ? user.id : null,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.Phone,
        district: formData.District,
        upozila: formData.Upozila,
        city: formData.city,
        address: formData.address,
        payment_method: formData.paymentMethod,
        phone_number_payment: formData.senderAccountNumber,
        transaction_id: formData.transactionId,
        order_items: [
            {
                product: product_id,
                quantity: quantity,
                price: product.price,
                color: color,
                size: size,
            },
        ],
    };

    try {
        const response = await fetch("http://localhost:8000/api/orders/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authToken && { Authorization: `Bearer ${authToken}` }),
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error("Failed to submit order.");
        }

        const responseData = await response.json();
        console.log("Order submitted successfully:", responseData);
        setOrderComplete(true); // Mark order as complete
    } catch (error) {
        console.error("Error:", error);
        setError("Failed to submit order. Please try again.");
    }
}

    const steps = isAuthenticated
        ? ["Cart Summary", "Shipping Details", "Payment", "Confirmation"]
        : ["Cart Summary", "Create Account", "Shipping Details", "Payment", "Confirmation"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log("formData: ", formData);
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
        return ((product?.price || 0) * quantity) + 80;
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
                                <Typography variant="h6" color="primary">
                                    Price : {product.price} Taka
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Quantity: {quantity}
                                </Typography>
                                <Typography variant="body2">
                                    Color : {color}
                                </Typography>
                                <Typography variant="body2">
                                    Size : {size}
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
                    onChange={handleInputChange}
                    value={formData.firstName}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
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
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    error={!!formErrors.Phone}
                    helperText={formErrors.Phone}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="District"
                    name="District"
                    value={formData.District}
                    onChange={handleInputChange}
                    error={!!formErrors.District}
                    helperText={formErrors.District}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Upozila"
                    name="Upozila"
                    value={formData.Upozila}
                    onChange={handleInputChange}
                    error={!!formErrors.Upozila}
                    helperText={formErrors.Upozila}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="City/Town"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
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
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                    required
                />
            </Grid>
        </Grid>
    );

    const renderPaymentSection = () => {
        const paymentInstructions = {
            bkash: {
                steps: [
                    "Go to your bKash app or Dial *247#",
                    "Choose ‘Send Money’",
                    "Enter below bKash Account Number",
                    "Enter total amount",
                    "Now enter your bKash Account PIN to confirm the transaction",
                    "Copy Transaction ID from payment confirmation message and paste below"
                ],
                accountType: "Personal",
                accountNumber: "017********"
            },
            rocket: {
                steps: [
                    "Go to your Rocket app or Dial *322#",
                    "Choose ‘Send Money’",
                    "Enter below Rocket Account Number",
                    "Enter total amount",
                    "Now enter your Rocket Account PIN to confirm the transaction",
                    "Copy Transaction ID from payment confirmation message and paste below"
                ],
                accountType: "Personal",
                accountNumber: "017********"
            },
            nagad: {
                steps: [
                    "Go to your Nagad app or Dial *167#",
                    "Choose ‘Send Money’",
                    "Enter below Nagad Account Number",
                    "Enter total amount",
                    "Now enter your Nagad Account PIN to confirm the transaction",
                    "Copy Transaction ID from payment confirmation message and paste below"
                ],
                accountType: "Personal",
                accountNumber: "017********"
            },
            upay: {
                steps: [
                    "Go to your Upay app or Dial *268#",
                    "Choose ‘Send Money’",
                    "Enter below Upay Account Number",
                    "Enter total amount",
                    "Now enter your Upay Account PIN to confirm the transaction",
                    "Copy Transaction ID from payment confirmation message and paste below"
                ],
                accountType: "Personal",
                accountNumber: "017********"
            }
        };

        const selectedPayment = formData.paymentMethod;
        const instructions = paymentInstructions[selectedPayment];

        return (
            <Box>
                <Typography variant="h6" gutterBottom>Payment Method</Typography>
                <RadioGroup name="paymentMethod" value={selectedPayment} onChange={handleInputChange}>
                    {Object.keys(paymentInstructions).map((method) => (
                        <FormControlLabel
                            key={method}
                            value={method}
                            control={<Radio />}
                            label={<Box sx={{ display: "flex", alignItems: "center" }}>
                                <FaMoneyBillWave size={24} style={{ marginRight: "8px" }} />
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                            </Box>}
                        />
                    ))}
                </RadioGroup>
                {instructions && (
                    <Box sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                        <Typography variant="subtitle1">Instructions for {selectedPayment.toUpperCase()}</Typography>
                        <ul>
                            {instructions.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ul>
                        <Typography variant="body1">You need to send: ${calculateTotal().toFixed(2)} /-</Typography>
                        <Typography variant="body1">Account Type: {instructions.accountType}</Typography>
                        <Typography variant="body1">Account Number: {instructions.accountNumber}</Typography>
                        <TextField
                            fullWidth
                            label="Your Account Number"
                            name="senderAccountNumber"
                            onChange={handleInputChange}
                            value={formData.senderAccountNumber}
                            required
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Transaction ID"
                            name="transactionId"
                            onChange={handleInputChange}
                            value={formData.transactionId}
                            required
                            sx={{ mt: 2 }}
                        />
                    </Box>
                )}
            </Box>
        );
    };


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
                        <Button
                            variant="contained"
                            onClick={
                                isPaymentStep ? submitOrder : handleNext
                            }
                            color="primary"
                            disabled={activeStep === 2 && !formData.transactionId}
                        >
                            {isPaymentStep ? "Confirm" : isCreateAccountStep ? "Skip" : "Next"}
                        </Button>
                    )}
                </Box>
            </Paper>
        </StyledContainer>
    );
};

export default OrderProcess;

