import React, { useEffect, useState } from 'react';
import { Grid, Container, CircularProgress, Typography, Box, Button } from '@mui/material';
import ProductCard from './ProductCard';
import { BaseUrls } from '../env';

const fetchItems = async () => {
  try {
    const response = await fetch(`${BaseUrls}items/`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const RelatedProducts = ({ ProductCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchItems();
        // console.log(ProductCategory.name);
  
        // Filter products based on the category name
        const filteredProducts = data.filter(item => item.category.name === ProductCategory.name);
        // console.log(filteredProducts);
  
        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message || 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ProductCategory]);
  
  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchItems()
      .then((data) => {
        const filteredProducts = data.filter(item => item.category === ProductCategory);
        setProducts(filteredProducts);
      })
      .catch((err) => setError(err.message || 'Failed to load products. Please try again later.'))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: '#E7C400' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
        <Button onClick={retryFetch} variant="contained" color="primary" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
        Related Products
      </Typography>

      <Grid container spacing={2}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid
              item
              key={product.id}
              xs={6}
              sm={4}
              md={3}
              lg={2.4}
            >
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ width: '100%', mt: 5 }}>
            No products available
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default RelatedProducts;
