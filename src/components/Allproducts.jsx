import React, { useEffect, useState } from 'react';
import { Grid, Container, CircularProgress, Typography, Box, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProductCard from './ProductCard';
import PersistentDrawerLeft from './Drawer';
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

const fetchCategories = async () => {
  try {
    const response = await fetch(`${BaseUrls}categories/`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const AllProducts = () => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [loading, setLoading] = useState(!products.length);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]); // Store selected category IDs

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchItems();
        setProducts(data);
        localStorage.setItem('products', JSON.stringify(data));
      } catch (err) {
        setError(err.message || 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (!products.length) {
      fetchData();
    }
  }, [products.length]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategoryData();
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchItems()
      .then((data) => {
        setProducts(data);
        localStorage.setItem('products', JSON.stringify(data));
      })
      .catch((err) => setError(err.message || 'Failed to load products. Please try again later.'))
      .finally(() => setLoading(false));
  };

  const handleCategorySelect = (selected) => {
    setSelectedCategories(selected); // Update selected category IDs
    console.log('Selected Category IDs:', selected); // Log selected category IDs for testing
  };

  // Filter products based on selected category IDs
  const filteredProducts = selectedCategories.length
    ? products.filter((product) => selectedCategories.includes(product.category_id))
    : products;

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
      <Box sx={{ position: 'absolute', top: 60, left: 0, color:'#E7C400', background: '#272727', width: '100%' }}>
        <IconButton onClick={() => setDrawerOpen(!drawerOpen)} color="primary" aria-label="open drawer">
          <MenuIcon sx={{ color: '#E7C400', fontSize: 30, marginLeft: 5 }} />
        </IconButton>
        Open Filter
      </Box>

      <PersistentDrawerLeft
        open={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        onCategorySelect={handleCategorySelect}
        categories={categories} // Pass categories to Drawer component
      />

      <Box sx={{ height: '50px' }} />

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
    </Container>
  );
};

export default AllProducts;
