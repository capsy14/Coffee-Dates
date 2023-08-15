import React from "react";
// import products from "../data.json";
const products = [
  {
    name: "Espresso",
    price: 260,
    rating: 4.5,
    imgSrc:
      "https://tse4.mm.bing.net/th?id=OIP.sjkwtF6Q1tmhvrwu9VK8XwHaHa&pid=Api&P=0&h=180",
  },
  {
    name: "Cappuccino",
    price: 290,
    rating: 4.7,
    imgSrc:
      "https://tse4.mm.bing.net/th?id=OIP.3thd4i6u3PRBaSZjOuE-uQHaFJ&pid=Api&P=0&h=180",
  },
  {
    name: "Mocha",
    price: 330,
    rating: 4.8,
    imgSrc:
      "https://tse3.mm.bing.net/th?id=OIP.k6HrjsWU1C995rHH4dQVmAHaF1&pid=Api&P=0&h=180",
  },
  //   {
  //     name: "Americano",
  //     price: 260,
  //     rating: 4.4,
  //     imgSrc:
  //       "https://tse1.mm.bing.net/th?id=OIP.jbkyjcieSo2YG_eT0q8OLQHaHa&pid=Api&P=0&h=180",
  //   },
];

const Feature = () => {
  return (
    <>
      <h2 id="feature">Featured Products</h2>
      <div className="product1">
        {products.map((product, index) => (
          <div className="pro" key={index}>
            <img src={product.imgSrc} alt={product.name} />
            <div className="des">
              <h5>{product.name}</h5>
              <div className="star">{renderStars(product.rating)}</div>
              <h4>₹{product.price}</h4>
              <button>
                <a href="#">
                  <ion-icon name="cart"></ion-icon>
                </a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

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

export default Feature;
