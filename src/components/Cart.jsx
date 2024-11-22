import React, { useState } from "react";
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
    styled
} from "@mui/material";
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import {useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
    display: "flex",
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[4]
    }
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "4px",
    padding: theme.spacing(0.5)
}));

const Cart = () => {
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 299.99,
            quantity: 1,
            image: "images.unsplash.com/photo-1505740420928-5e560c06d30e"
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            price: 199.99,
            quantity: 2,
            image: "images.unsplash.com/photo-1523275335684-37898b6baf30"
        },
        {
            id: 3,
            name: "Portable Power Bank",
            price: 49.99,
            quantity: 1,
            image: "images.unsplash.com/photo-1593439147804-c6c7656530ae"
        }
    ]);

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        setLoading(true);
        try {
            const updatedItems = cartItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            setCartItems(updatedItems);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (id) => {
        setLoading(true);
        try {
            const updatedItems = cartItems.filter(item => item.id !== id);
            await new Promise(resolve => setTimeout(resolve, 500));
            setCartItems(updatedItems);
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const subtotal = calculateSubtotal();
    const shipping = 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    const navigate = useNavigate();
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
                    {cartItems.map(item => (
                        <StyledCard key={item.id}>
                            <CardMedia
                                component="img"
                                sx={{ width: 140 }}
                                image={`https://${item.image}`}
                                alt={item.name}
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1610824352934-c10d87b700cc";
                                }}
                            />
                            <CardContent sx={{ flex: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="start">
                                    <Typography variant="h6" component="h2">
                                        {item.name}
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
                                    ${item.price.toFixed(2)}
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
                                <Typography sx={{ mt: 2 }}>
                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    ))}
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
                                    <Typography>${subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Shipping</Typography>
                                    <Typography>${shipping.toFixed(2)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Tax</Typography>
                                    <Typography>${tax.toFixed(2)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6">${total.toFixed(2)}</Typography>
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