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
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("authToken");
  const [hasFetched, setHasFetched] = useState(false); 

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

  const steps = ["Cart Summary", "Shipping Details", "Payment", "Confirmation"];

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
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
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          error={!!formErrors.city}
          helperText={formErrors.city}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          error={!!formErrors.postalCode}
          helperText={formErrors.postalCode}
          required
        />
      </Grid>
    </Grid>
  );

  const renderPaymentSection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Payment Method</Typography>
      <RadioGroup
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleInputChange}
      >
        <FormControlLabel
          value="bkash"
          control={<Radio />}
          label={<Box sx={{ display: "flex", alignItems: "center" }}>
            <FaMoneyBillWave size={24} style={{ marginRight: "8px" }} />
            bKash
          </Box>}
        />
        <FormControlLabel
          value="nagad"
          control={<Radio />}
          label={<Box sx={{ display: "flex", alignItems: "center" }}>
            <FaMoneyBillWave size={24} style={{ marginRight: "8px" }} />
            Nagad
          </Box>}
        />
        <FormControlLabel
          value="dutch-bangla"
          control={<Radio />}
          label={<Box sx={{ display: "flex", alignItems: "center" }}>
            <FaMoneyBillWave size={24} style={{ marginRight: "8px" }} />
            Dutch-Bangla Bank
          </Box>}
        />
      </RadioGroup>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Transaction ID"
          name="transactionId"
          value={formData.transactionId}
          onChange={handleInputChange}
          error={!!formErrors.transactionId}
          helperText={formErrors.transactionId}
          required
        />
      </Box>
    </Box>
  );

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
    switch (step) {
      case 0:
        return renderCartSummary();
      case 1:
        return renderShippingForm();
      case 2:
        return renderPaymentSection();
      case 3:
        return renderConfirmation();
      default:
        return "Unknown step";
    }
  };

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
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              color="primary"
              disabled={activeStep === 2 && !formData.transactionId}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </StyledContainer>
  );
};

export default OrderProcess;