import React, { useEffect, useState } from "react";
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
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: "2rem",
  marginBottom: "2rem",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "1rem",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const OrderProcess = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("authToken");
  const [hasFetched, setHasFetched] = useState(false);
  const isPaymentStep = isAuthenticated ? activeStep === 2 : activeStep === 3;
  const isCreateAccountStep = isAuthenticated ? false : (activeStep === 1);

  
  const [accountData, setAccountData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const handleChange = (field) => (event) => {
    setFormValues({ ...formValues, [field]: event.target.value });
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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

  const handleAccountSubmit = () => {
    if (!accountData.email || !accountData.password) {
      setError("Email and Password are required.");
      return;
    }

    if (!isAuthenticated && accountData.password !== accountData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate authentication
    localStorage.setItem("authToken");
    setIsAuthenticated(true);
    setActiveStep((prev) => prev + 1); // Move to next step
  };

  // cart Details
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/cart/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const cartData = await response.json();
        console.log("Cart Items:", cartData);
        setCartItems(cartData);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartDetails();
  }, [token]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      // Skip "Create Account" Step
    }
  }, [token]);

  // Fetch product details and merge with cart data
  useEffect(() => {
    // If cartItems are empty or already fetched, don't run the effect again
    if (!cartItems.length || hasFetched) return;

    const fetchItemDetails = async () => {
      try {
        const productPromises = cartItems.map(async (cartItem) => {
          const response = await fetch(
            `http://localhost:8000/api/product/${cartItem.item}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch product details for item ${cartItem.item}`);
          }

          const productData = await response.json();

          // Merge product details with cart item
          return {
            id: productData.product_id,
            name: productData.title,
            price: productData.price,
            quantity: cartItem.quantity,
            image: productData.image,
          };
        });

        const mergedCart = await Promise.all(productPromises);
        setHasFetched(true); // Mark as fetched to prevent re-fetching
        setCartItems(mergedCart);
        console.log("Merged Cart Details:", mergedCart);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchItemDetails();
  }, [cartItems, token, hasFetched]); // Trigger the effect when cartItems or token change

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
    transactionId: ""
  });

  const steps = isAuthenticated
    ? ["Cart Summary", "Shipping Details", "Payment", "Confirmation"]
    : ["Cart Summary", "Create Account", "Shipping Details", "Payment", "Confirmation"];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...formErrors };

    switch (name) {
      case "email":
        errors.email = !/\S+@\S+\.\S+/.test(value) ? "Invalid email address" : "";
        break;
      case "phone":
        errors.phone = !/^\d{10}$/.test(value) ? "Invalid phone number" : "";
        break;
      case "postalCode":
        errors.postalCode = !/^\d{5}(-\d{4})?$/.test(value) ? "Invalid postal code" : "";
        break;
      case "transactionId":
        errors.transactionId = !value ? "Transaction ID is required" : "";
        break;
      default:
        errors[name] = !value ? `${name} is required` : "";
    }

    setFormErrors(errors);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      setOrderComplete(true);
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleBackClick = () => {
    if (activeStep === steps.length - 1) {
      navigate("/"); // Redirect to home when on the last step
    } else {
      handleBack(); // Otherwise, go back to the previous step
    }
  };
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryCharge = 80;
    return subtotal + deliveryCharge;
  };
  

  const renderCartSummary = () => (
    <Box>
      {cartItems.map((item) => (
        <StyledCard key={item.id}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.name}
                sx={{ objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </StyledCard>
      ))}
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h5" gutterBottom>Total: ${calculateTotal().toFixed(2)}</Typography>
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
          label="City"
          name="City"
          value={formData.City}
          onChange={handleInputChange}
          error={!!formErrors.City}
          helperText={formErrors.City}
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
      
      {/* {loginButtonClicked && (
        <Button
          variant="outlined"
          fullWidth
          startIcon={<img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" width="20" />}
          sx={{ mb: 2, textTransform: "none", color: "text.primary", borderColor: "grey.400" }}
        >
          Log in with Google
        </Button>
      )}
      
      {loginButtonClicked && <Divider sx={{ my: 2 }}>or</Divider>} */}
      
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
            <Typography variant="body1">You need to send: ${calculateTotal().toFixed(2)} BDT</Typography>
            <Typography variant="body1">Account Type: {instructions.accountType}</Typography>
            <Typography variant="body1">Account Number: {instructions.accountNumber}</Typography>
            <TextField
              fullWidth
              label="Your Account Number"
              name="senderAccountNumber"
              value={formData.senderAccountNumber}
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Transaction ID"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleInputChange}
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
      {orderComplete && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Order successfully placed! Your order number is #12345
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Order Summary</Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Shipping Details:</Typography>
            <Typography color="text.secondary">
              {formData.firstName} {formData.lastName}<br />
              {formData.address}<br />
              {formData.city}, {formData.postalCode}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Payment Method:</Typography>
            <Chip
              icon={<FaMoneyBillWave />}
              label={formData.paymentMethod.replace("-", " ").toUpperCase()}
              color="primary"
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Transaction ID: {formData.transactionId}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Total Amount: ${calculateTotal().toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
  const getStepContent = (step) => {
    const steps = isAuthenticated
      ? [renderCartSummary, renderShippingForm, renderPaymentSection, renderConfirmation]
      : [renderCartSummary, renderCreateAccount, renderShippingForm, renderPaymentSection, renderConfirmation];
  
    return steps[step] ? steps[step]() : "Unknown step";
  };

  console.log("acctive Step:", activeStep);
  

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
        {getStepContent(activeStep)}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBackClick} sx={{ mr: 1 }} variant="outlined">
              {activeStep === steps.length - 1 ? "Back to Home" : "Back"}
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
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