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
import { BaseUrls } from "../env";

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

  // cart Details
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await fetch(`${BaseUrls}/api/cart/`, {
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

  useEffect(() => {
    if (!cartItems.length || hasFetched) return;
  
    const fetchItemDetails = async () => {
      try {
        const productPromises = cartItems.map(async (cartItem) => {
          const response = await fetch(`${BaseUrls}/api/product/${cartItem.item}/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch product details for item ${cartItem.item}`);
          }
  
          const productData = await response.json();
  
          return {
            id: productData.id, // Assuming 'id' is the primary key
            product_id: productData.product_id, // Keep if needed
            name: productData.title,
            price: productData.price,
            quantity: cartItem.quantity,
            product_color: cartItem.item_color_code,
            image: productData.image || "", // Ensure image exists
            size: cartItem.item_size,
          };
        });
  
        const mergedCart = await Promise.all(productPromises);
        setHasFetched(true);
        setCartItems(mergedCart);
  
        setFormData(prevFormData => ({
          ...prevFormData,
          products: mergedCart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            color: item.product_color,
            size: item.size,
          }))
        }));
        console.log("Merged Cart Items:", mergedCart);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
  
    fetchItemDetails();
  }, [cartItems, token, hasFetched]);

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
      order_items: cartItems.map(item => ({
        product: item.product_id,
        quantity: item.quantity,
        price: item.price,
        color: item.product_color,
        size: item.size,
      })),
    };
  
    try {
      const response = await fetch(`${BaseUrls}api/orders/`, {
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
  
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit order. Please try again.");
      console.log("Order Data:", orderData);
    }
  }
  
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
  
  const steps = isAuthenticated
    ? ["Cart Summary", "Shipping Details", "Payment", "Confirmation"]
    : ["Cart Summary", "Create Account", "Shipping Details", "Payment", "Confirmation"];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    validateField(name, value); // Keep validation
    console.log("Form Data:", { ...formData, [name]: value });
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
                <Typography variant="body1" color="text.secondary">
                  Color : {item.product_color}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Size : {item.size}
                </Typography>
                <Typography variant="h6" color="primary">
                  Price : ${(item.price * item.quantity).toFixed(2)}
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
              {formData.city}, <br />
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
    const steps = [renderCartSummary, renderShippingForm, renderPaymentSection, renderConfirmation]
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
              onClick={isPaymentStep ? () => { handleNext(); submitOrder(); } : handleNext}
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