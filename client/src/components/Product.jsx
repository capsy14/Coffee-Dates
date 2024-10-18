import React from "react";
import products from "./data.json";
import { Link } from "react-router-dom";

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
    <>
      <div className="catalog sm:bg-cover bg-right-toptop md:bg-left-top"></div>
      <div className="product1">
        {products.map((product, index) => (
          <Link to={`/wallet/${index}`} key={index}>
            <div className="pro">
              <img src={product.imgSrc} alt={product.name} />
              <div className="des">
                <h5>{product.name}</h5>
                <p>{product.description}</p>
                <div className="star">{renderStars(product.rating)}</div>
                <h4>₹{product.price}</h4>
                <button>
                  <Link to={`/wallet/${index}`}>
                    Buy Now
                    {/* <ion-icon name="cart"> Buy Now</ion-icon> */}
                  </Link>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Product;
