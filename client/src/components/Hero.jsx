import React from "react";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero_text">
        {/* <h4>Welcome to Koffe Ka Chakkar</h4> */}
        <br />
        <h1 className="super sm:text-5xl text-3xl">
          Coffee Talks and Heartfelt Walks
        </h1>
        <h1 className="on">Connect, Love</h1>
        <br />
        {/* <p>Save more with coupons & up to 70% off!</p> */}
        <br />
        <button className="shop">
          <a href="/product">Grab Your Coffee</a>
        </button>
      </div>
    </div>
  );
}
