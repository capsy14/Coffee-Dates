import React from "react";
import { ethers } from "ethers";
import "../styles/buy.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Buy = () => {
  const buycofee = async (e) => {};

  return (
    <div className="buy-buy-container ">
      <div className="buy-container">
        {" "}
        {/* Apply the CSS class */}
        <form className="buy-form" onSubmit={buycofee}>
          {" "}
          {/* Apply the CSS class */}
          <label>Name of beloved</label>
          <input
            type="text"
            className="inputbuy"
            id="name"
            placeholder="Enter your name"
          />
          <label>Message</label>
          <input
            type="text"
            className="inputbuy"
            id="message"
            placeholder="Enter a love message"
          />
          <p>
            Hey lover, your bill is $3.69.
            <br /> Thanks a bunch!
          </p>
          <button type="submit">PAY</button>
        </form>
      </div>
    </div>
  );
};

export default Buy;
