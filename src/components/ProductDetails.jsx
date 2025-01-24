import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import Rating from '@mui/material/Rating';
import QuantityInput from '../components/QuantityInput';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseUrls } from '../env';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import RelatedProducts from './ReletedProducts';


const ProductDetails = () => {
  const { product_id } = useParams();
  const ItemsUrls = `${BaseUrls}items/${product_id}/`;
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [ProductCategory, setProductCategory] = useState('');
  const [selectedColor, setselectedColor] = useState([]);
  const [selectedSize, setselectedSize] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(ItemsUrls);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setItems(data);
        setProductCategory(data.category);
        setMainImage(data.image || '');
        if (data.item_color) {
          setselectedColor(data.item_color[0].color.name);
        }
        if (data.item_size) {
          setselectedSize(data.item_size[0].size.name);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [ItemsUrls]);

  const handleAddToCart = () => {
    
  };

  const handleBuyNow = () => {
    // navigate('/checkout');
    console.log('Quantity added to cart:', quantity);
    console.log('Selected color:', selectedColor);
    console.log('Selected size:', selectedSize);
  };

  const handleImageClick = (index) => {
    if (items.images && items.images[index]) {
      setMainImage(items.images[index].image);
    }
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
    title: items.title || 'No Title Available',
    price: items.price || 0,
    discountPrice: items.discount_price || items.price,
    description: items.description || 'No description available',
    colors: items.item_color?.map((c) => c.color.name) || ['No colors available'],
    sizes: items.item_size?.map((s) => s.size.name) || ['No sizes available'],
    mainImage: items.image,
    material: '100% cotton, 170gsm',
    printQuality: 'DTF Print',
    deliveryCharge: '80 taka',
    deliveryTime: '3-5 Days',
    rating: items.ratings?.value || 0,
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            pt: 2,
            pb: 2,
            pl: { xs: 2, sm: 4, md: 10 },
            pr: { xs: 2, sm: 4, md: 4 },
          }}
        >
          <Grid item xs={12} sm={6} md={6}>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <img
                  src={mainImage || 'https://via.placeholder.com/500'}
                  alt="Main Product"
                  style={{ width: '100%', borderRadius: '5px' }}
                />
              </Box>
              <Grid container spacing={2} justifyContent="center">
                {items.images?.map((img, index) => (
                  <Grid item key={index} xs={3}>
                    <img
                      src={img.image || 'https://via.placeholder.com/100'}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        border: mainImage === img.image ? '2px solid #E7C400' : 'none',
                      }}
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
                  <Typography
                    variant="h4"
                    sx={{ marginTop: 2, fontWeight: 'bold', color: '#000000' }}
                  >
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
                  <Typography variant="body1" sx={{ color: '#000000', mt: 2 }}>
                    <Rating value={productData.rating} readOnly />
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ marginTop: 2, color: '#000000' }}>
                    Available Colors:
                  </Typography>
                  <Box>
                    {productData.colors?.map((color) => (
                      <RadioGroup
                        row
                        aria-label="colors"
                        name="row-radio-buttons-group"
                        sx={{
                          display: 'flex',
                          alignItems: 'center', // Vertically align the radio and text in the center
                        }}
                      >
                        <Radio
                          key={color}
                          value={color}
                          checked={selectedColor === color}
                          onChange={() => setselectedColor(color)}
                          sx={{
                            color: color, // Default (unchecked) color
                            '&.Mui-checked': {
                              color: color, // Checked color
                            },
                          }}
                        />
                        <span
                          style={{
                            color: selectedColor === color ? color : '#000000', // Set text color based on selected state
                            marginLeft: '8px', // Optional spacing between the radio and text
                            display: 'inline-flex', // Ensures text stays on the same line as the radio button
                            alignItems: 'center', // Vertically aligns the text with the radio button
                          }}
                        >
                          {color}
                        </span>
                      </RadioGroup>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ marginTop: 2, color: '#000000' }}>
                    Available Sizes:
                  </Typography>
                  <Box>
                    {productData.sizes?.map((size) => (
                      <RadioGroup
                        row
                        aria-label="sizes"
                        name="row-radio-buttons-group"
                        sx={{
                          display: 'flex',
                          alignItems: 'center', // Vertically align the radio and text in the center
                        }}
                        key={size} // Add key here for each size
                      >
                        <Radio
                          value={size} // Set the size as the value
                          checked={selectedSize === size} // Check if this size is selected
                          onChange={() => setselectedSize(size)} // Update the selected size
                          sx={{
                            
                          }}
                        />
                        <span
                          style={{
                            marginLeft: '8px', // Spacing between the radio and text
                            display: 'inline-flex', // Keep text in line with the radio button
                            alignItems: 'center', // Align text and radio button vertically
                          }}
                        >
                          {size}
                        </span>
                      </RadioGroup>
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