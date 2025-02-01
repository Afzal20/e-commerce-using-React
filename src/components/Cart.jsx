import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  CircularProgress,
  Container,
  styled,
} from "@mui/material";
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "4px",
  padding: theme.spacing(0.5),
}));

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // Fetch cart details
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

        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartDetails();
  }, [token]);

  // Fetch product details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const productPromises = cartItems.map(async (item) => {
          const response = await fetch(
            `http://localhost:8000/api/product/${item.item}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch product details for item ${item.item}`);
          }

          return response.json();
        });

        const products = await Promise.all(productPromises);
        setProductDetails(products);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (cartItems.length > 0) {
      fetchItemDetails();
    }
  }, [cartItems, token]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
  
    try {
      const response = await fetch(`http://localhost:8000/api/cart/update/${id}/`, {
        method: "PATCH", // Use PATCH to update only the quantity field
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }
  
      const updatedItem = await response.json();
  
      // Update UI after successful update
      const updatedItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: updatedItem.quantity } : item
      );
      setCartItems(updatedItems);
      window.location.reload();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const removeItem = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/cart/remove/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
      window.location.reload();
  
      // Update UI after successful deletion
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item, index) => {
      const product = productDetails[index];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 80;
  const total = subtotal + shipping ;

  const handleCheckout = () => {
    navigate("/order");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item, index) => {
            const product = productDetails[index];
            return (
              <StyledCard key={item.id}>
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}
                  image={product?.image || "https://via.placeholder.com/140"}
                  alt={product?.title || "Product"}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Typography variant="h6" component="h2">
                      {product?.title || "Loading..."}
                    </Typography>
                    <IconButton
                      aria-label="Remove item"
                      onClick={() => removeItem(item.id)}
                      color="error"
                    >
                      <FiTrash2 />
                    </IconButton>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {product?.price?.toFixed(2) || "N/A"}/-
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <QuantityButton
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FiMinus />
                    </QuantityButton>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <QuantityButton
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FiPlus />
                    </QuantityButton>
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Color: {item.item_color_code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Size: {item.item_size}
                    </Typography>
                  </Box>
                    <Typography sx={{ mt: 2 }}>
                      Subtotal: {product ? (product.price * item.quantity).toFixed(2) : "0.00"}/-
                    </Typography>
                </CardContent>
              </StyledCard>
            );
          })}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Subtotal</Typography>
                  <Typography>{subtotal.toFixed(2)}/-</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Shipping</Typography>
                  <Typography>{shipping.toFixed(2)}/-</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">{total.toFixed(2)}/-</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FiShoppingCart />}
                disabled={loading || cartItems.length === 0}
                sx={{ mt: 2 }}
                aria-label="Proceed to checkout"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
