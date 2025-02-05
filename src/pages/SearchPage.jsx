import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchItems } from "../context/api";
import { Grid, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


// Function to get search query from URL
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
    const [items, setItems] = useState([]); // All items
    const [filteredItems, setFilteredItems] = useState([]); // Filtered results
    const query = useQuery().get("q") || ""; // Get 'q' from URL

    // Fetch data from API on mount
    useEffect(() => {
        const loadItems = async () => {
            try {
                const data = await fetchItems();
                setItems(data);
                setFilteredItems(data); // Initially show all
            } catch (err) {
                
            }
        };
        loadItems();
    }, []);

    // Function to filter products based on the query
    const filterItems = (search) => {
        if (!search) {
            setFilteredItems(items);
            return;
        }

        const lowerSearch = search.toLowerCase();

        const results = items.filter((item) =>
            item.title.toLowerCase().includes(lowerSearch) ||
            item.category.name.toLowerCase().includes(lowerSearch) ||
            item.type.name.toLowerCase().includes(lowerSearch) ||
            item.description.toLowerCase().includes(lowerSearch)
        );

        setFilteredItems(results);
    };

    // Apply filter when query changes
    useEffect(() => {
        filterItems(query);
    }, [query, items]);

    return (
        <Container sx={{ marginTop: 5 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
                All Products
            </Typography>
            <Grid container spacing={2}>
                {filteredItems.map((product) => (
                    <div className="product-card">
                        {/* Single Link wrapping the entire card */}
                        <Link to={`/product/${product.product_id}`} className="product-link">
                            <div className="product-image">
                                <img src={product.image} alt={product.title} />
                                {product.discount_price > 0 && <div className="product-category">Sale</div>}
                            </div>
                            <div className="product-details">
                                <h3>{product.title}</h3>
                                <p className="product-prices">
                                    {product.discount_price > 0 ? (
                                        <>
                                            <span className="price-cut">{product.price}৳</span>
                                            <span className="price-discount">{product.discount_price}৳</span>
                                        </>
                                    ) : (
                                        <span className="price">{product.price}৳</span>
                                    )}
                                </p>
                                <p className="product-stock">
                                    {product.number_of_items > 0 ? "In Stock" : "Out of Stock"}
                                </p>
                                {/* Removed nested Link */}
                                <span className="view-details">View Details</span>
                            </div>
                        </Link>
                    </div>
                ))}
                {/* {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Grid item key={product.id} xs={6} sm={4} md={3} lg={2.4}>
                            <ProductCard product={product} />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center" sx={{ width: '100%', mt: 5 }}>
                        No products available
                    </Typography>
                )} */}
            </Grid>
        </Container>
    );
};

export default SearchPage;
