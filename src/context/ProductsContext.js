import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchItems } from './api'; // Adjust the path based on your structure

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products only if not already loaded
  useEffect(() => {
    const loadProducts = async () => {
      if (products.length === 0) { // Check if products are already loaded
        setLoading(true);
        try {
          const data = await fetchItems();
          setProducts(data);
        } catch (err) {
          setError('Failed to load products. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
