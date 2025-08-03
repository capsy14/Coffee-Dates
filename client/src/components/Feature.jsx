import React from "react";
import { Link } from "react-router-dom";
import products from "./data.json";

// Get featured products (first 3 items from data.json)
const featuredProducts = products.slice(0, 3);

const Feature = () => {
  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (halfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <div className="featured-badge">
            <span className="featured-icon">⭐</span>
            <span className="featured-text">Handpicked</span>
          </div>
          <h2 className="featured-title">Featured Coffee Collection</h2>
          <p className="featured-subtitle">
            Discover our most popular coffee blends, carefully selected to enhance your dating experience
          </p>
        </div>
        
        <div className="featured-grid">
          {featuredProducts.map((product, index) => (
            <div className="featured-card" key={index}>
              <div className="featured-image">
                <img src={product.imgSrc} alt={product.name} />
                <div className="featured-overlay">
                  <div className="rating-badge">
                    <span className="star-icon">★</span>
                    <span className="rating-number">{product.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="featured-info">
                <h3 className="featured-name">{product.name}</h3>
                <p className="featured-description">{product.description}</p>
                
                {product.paymentMethod && (
                  <div className="featured-payment-badge">
                    <span className="payment-text">Available on {product.paymentMethod}</span>
                  </div>
                )}
                
                <div className="featured-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">({product.rating}/5)</span>
                </div>
                
                <div className="featured-footer">
                  <div className="price-section">
                    <span className="currency">₹</span>
                    <span className="price">{product.price}</span>
                  </div>
                  
                  <Link to={`/product/${index}`} className="featured-btn">
                    <span className="btn-icon">☕</span>
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="featured-cta">
          <Link to="/product" className="view-all-btn">
            <span className="btn-text">View All Coffee</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Feature;
