import React from 'react';
import { useProducts } from '../context/ProductsContext';
import { Grid, Container, CircularProgress, Typography, Box } from '@mui/material';
import ProductCard from './ProductCard';

const AllProducts = ({ selectedCategories }) => {
  const { products, loading, error } = useProducts();

  // Filter products by selected categories
  const filteredProducts = products.filter(product =>
    selectedCategories.length === 0 || selectedCategories.includes(product.category.name)
  );

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
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
        All Products
      </Typography>
      <Grid container spacing={2}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item key={product.id} xs={6} sm={4} md={3} lg={2.4}>
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ width: '100%', mt: 5 }}>
            No products available
          </Typography>
        )}
      </Grid>
      <Box sx={{ height: 10 }} />
    </Container>
  );
};

export default AllProducts;
