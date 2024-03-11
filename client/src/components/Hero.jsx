import React from "react";

export default function Hero() {
  return (
    <div className="hero">
      <div className="ml-6 sm:ml-36">
        {/* <h4>Welcome to Koffe Ka Chakkar</h4> */}
        <br />
        <h1 className="super sm:text-5xl text-3xl mt-8 ">
          Coffee Talks and Heartfelt Walks
        </h1>
        <h1 className="on">Connect, Love</h1>
        <br />
        {/* <p>Save more with coupons & up to 70% off!</p> */}
        <br />
        <button className="shop bottom-2 ">
          <a
            href="/product"
            className="sm:text-4xl text-2xl ml-10 text-[#008000] sm:text-[#DEB887] drop-shadow-xl rounded-md "
          >
            Grab Your Coffee
          </a>
        </button>
      </div>
    </div>
  );
}
