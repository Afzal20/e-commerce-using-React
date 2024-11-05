import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import QuantityInput from '../components/QuantityInput';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseUrls } from '../env';
import RelatedProducts from '../components/ReletedProducts';

const ProductDetails = () => {
  const { product_id } = useParams();
  const ItemsUrls = `${BaseUrls}items/${product_id}/`;
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [ProductCategory, setProductCategory] = useState(''); // Initialize as an empty string
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(ItemsUrls);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setItems(data);
        setProductCategory(data.category); // Correctly update the category
        setMainImage(data.image || ''); // Set initial main image after data is fetched
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [ItemsUrls]);

  const handleAddToCart = () => {
    console.log('Quantity added to cart:', quantity);
    // Implement actual cart addition logic here
  };

  const handleBuyNow = () => {
    navigate('/checkout');
  };

  const handleImageClick = (index) => {
    setMainImage(items.images[index].image); // Set clicked image as main
  };

  const handleQuantityChange = (newQuantity) => {
    const minQuantity = 1;
    const maxQuantity = 100; // Example maximum limit
    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    } else if (newQuantity < minQuantity) {
      setQuantity(minQuantity);
    } else {
      setQuantity(maxQuantity);
    }
  };

  if (loading || !items) return <Typography>Loading...</Typography>;

  const productData = {
    title: items.title,
    price: items.price,
    discountPrice: items.discount_price,
    description: items.description,
    colors: items.item_color?.map(c => c.color.name),
    sizes: items.item_size?.map(s => s.size.name),
    mainImage: items.image,
    material: '100% cotton, 170gsm',
    printQuality: 'DTF Print',
    deliveryCharge: 'Inside Dhaka 80 taka, Outside Dhaka 120 taka',
    deliveryTime: '3-5 Days',
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ pt: 2, pb: 2, pl: { xs: 2, sm: 4, md: 10 }, pr: { xs: 2, sm: 4, md: 4 } }}>
          <Grid item xs={12} sm={6} md={6}>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <img src={`http://localhost:8000${mainImage}`} alt="Big" style={{ width: '100%', borderRadius: '5px' }} />
              </Box>
              <Grid container spacing={2} justifyContent="center">
                {items.images?.map((img, index) => (
                  <Grid item key={index} xs={3}>
                    <img
                      src={`http://localhost:8000${img.image}`}
                      alt={`Small ${index + 1}`}
                      style={{ width: '100%', cursor: 'pointer', borderRadius: '5px' }}
                      onClick={() => handleImageClick(index)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#000000' }}>
                    Home / REGULAR COLLECTION / {productData.title}
                  </Typography>
                  <Typography variant="h4" sx={{ marginTop: 2, fontWeight: 'bold', color: '#000000' }}>
                    {productData.title}
                  </Typography>
                  <Typography variant="h5" sx={{ marginTop: 1, color: '#000000' }}>
                    Price: {productData.discountPrice || productData.price} Taka
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1, color: '#000000' }}>
                    {productData.description}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Colour: {productData.colors?.join(', ')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Size chart: {productData.sizes?.join(', ')}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Material: {productData.material}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Print Quality: {productData.printQuality}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Delivery charge: {productData.deliveryCharge}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Delivery Time: {productData.deliveryTime}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ marginTop: 2, color: '#000000' }}>
                    Available Colors:
                  </Typography>
                  <Box>
                    {productData.colors?.map((color) => (
                      <Button key={color} variant="outlined" sx={{ margin: 1, color: '#000000', borderColor: '#000000' }}>
                        {color}
                      </Button>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ marginTop: 2, color: '#000000' }}>
                    Available Sizes:
                  </Typography>
                  <Box>
                    {productData.sizes?.map((size) => (
                      <Button key={size} variant="outlined" sx={{ margin: 1, color: '#000000', borderColor: '#000000' }}>
                        {size}
                      </Button>
                    ))}
                  </Box>

                  <Box sx={{ margin: '10px' }}>
                    <QuantityInput value={quantity} onChange={handleQuantityChange} />
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<AddShoppingCartTwoToneIcon />}
                    sx={{
                      marginTop: 2,
                      color: '#000000',
                      background: '#E7C400',
                      padding: '8px',
                      marginX: '10px',
                      transition: 'background 0.3s, color 0.5s',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'black',
                        color: '#FFC107',
                      },
                    }}
                    onClick={handleAddToCart}
                  >
                    Add To Cart
                  </Button>

                  <Button
                    variant="outlined"
                    endIcon={<ShoppingBasketOutlinedIcon />}
                    sx={{
                      marginTop: 2,
                      color: '#000000',
                      background: '#E7C400',
                      padding: '8px',
                      marginX: '10px',
                      transition: 'background 0.3s, color 0.5s',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'black',
                        color: '#FFC107',
                      },
                    }}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <RelatedProducts ProductCategory={ProductCategory} />
    </>
  );
};

export default ProductDetails;
