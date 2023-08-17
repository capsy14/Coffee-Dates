import React from "react";
import { ethers } from "ethers";
import "../styles/buy.css"; // Import the CSS file

const Buy = ({ state }) => {
  const buycofee = async (e) => {
    e.preventDefault();
    const { contract } = state;
    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;
    console.log(name, message, contract);
    const amount = { value: ethers.utils.parseEther("0.002") };

    const transaction = await contract.buyCoffee(name, message, amount);
    await transaction.wait();
    console.log("Transaction is done");
    alert("Transaction is done");
  };

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
