import React from 'react';
import { Link } from 'react-router-dom';
import './css/ProductCard.css'; // Assuming you have a separate CSS file for styling

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
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
          <Link to={`/product/${product.product_id}`} className="view-details">
            View Details
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
