import React from "react";
import products from "./data.json";
import { Link } from "react-router-dom";
import "./Product.css";

const Product = () => {
  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<ion-icon key={i} name="star"></ion-icon>);
    }

    if (halfStar) {
      stars.push(<ion-icon key="half" name="star-half"></ion-icon>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<ion-icon key={`empty-${i}`} name="star-outline"></ion-icon>);
    }

    return stars;
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>☕ Premium Coffee Collection</h1>
        <p>Discover our handpicked selection of the finest coffee beans from around the world</p>
      </div>
      
      <div className="products-container">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <div className="product-image">
              <img src={product.imgSrc} alt={product.name} />
              <div className="product-overlay">
                <div className="rating-badge">
                  <ion-icon name="star"></ion-icon>
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              {product.paymentMethod && (
                <div className="payment-badge">
                  <span className="payment-text">Available on {product.paymentMethod}</span>
                </div>
              )}
              
              <div className="product-rating">
                {renderStars(product.rating)}
                <span className="rating-text">({product.rating}/5)</span>
              </div>
              
              <div className="product-footer">
                <div className="price-section">
                  <span className="currency">₹</span>
                  <span className="price">{product.price}</span>
                </div>
                
                <Link to={`/product/${index}`} className="buy-now-btn">
                  <ion-icon name="cafe"></ion-icon>
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
