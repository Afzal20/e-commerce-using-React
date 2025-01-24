import React from 'react';
import { Link } from 'react-router-dom';
import './css/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
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
  );
};

export default ProductCard;
