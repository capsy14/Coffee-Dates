import React, { useEffect } from "react";
import { ethers } from "ethers";
import "../styles/buy.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useSearchParams } from "react-router-dom";
import Product from "./data.json";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const param = useParams();
  const idd = param.id;

  return (
    <div className=" border-2 w-3/4 md:w-1/3 mt-25 align-middle items-center mx-auto p-5 bg-[#ECE4CF] rounded-lg drop-shadow-xl">
      <div className=" max-w-xs mx-auto justify-center flex items-center rounded-sm overflow-hidden">
        <img src={Product[idd].imgSrc} alt="" className="rounded-3xl w" />
      </div>
      <h1 className=" text-center text-2xl font-smbold">
        {Product[idd].name}{" "}
      </h1>
      <form className="buy-form" onSubmit={buycofee}>
        <label className=" ml-2 font-normal text-xl">Name of beloved</label>
        <input
          type="text"
          className="inputbuy text-lg drop-shadow-md"
          id="name"
          placeholder="Enter your name"
        />
        <label className=" ml-2 font-normal text-xl">Price</label>
        <input
          type="text"
          className="inputbuy text-lg drop-shadow-md"
          id="message"
          value={`₹${Product[idd].price}`} 
          disabled
        />

        <label className=" ml-2 font-normal text-xl">Message</label>
        <input
          type="text"
          className="inputbuy text-lg drop-shadow-md"
          id="message"
          placeholder="Enter a love message"
        />
        <p className=" font-light">
          Hey lover, your bill is ₹{Product[idd].price}.
          <br /> Thanks a bunch!
        </p>
        <button type="submit">PAY</button>
      </form>
    </div>
  );
};

export default Buy;
