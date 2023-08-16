import React from "react";

export default function Hero() {
  return (
    <>
      <div className="hero">
        <div className="hero_text">
          {/* <h4>Welcome to Koffe Ka Chakkar</h4> */}
          <br />
          <h1 className="super">Brew, Date</h1>
          <h1 className="on">Connect, Love</h1>
          <br />
          {/* <p>Save more with coupons & up to 70% off!</p> */}
          <br />
          <button className="shop">
            <a href="/product">Buy Now</a>
          </button>
        </div>
      </div>
    </>
  );
}
