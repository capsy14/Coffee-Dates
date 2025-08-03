import React, { useEffect } from "react";
import { ethers } from "ethers";
import "../styles/buy.css"; // Import the CSS file
import { showToast } from "../utils/toastUtils";
import { useParams, useSearchParams } from "react-router-dom";
import Product from "./data.json";
const Buy = ({ state }) => {
  const buycofee = async (e) => {
    e.preventDefault();
    const { contract } = state;
    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;
    
    if (!name || !message) {
      showToast.error("Please fill in all fields!");
      return;
    }
    
    try {
      console.log(name, message, contract);
      const displayPrice = Product[idd].price;
      showToast.info(`Processing payment of ₹${displayPrice}...`);
      
      const amount = { value: ethers.utils.parseEther("0.002") };

      const transaction = await contract.buyCoffee(name, message, amount);
      await transaction.wait();
      
      console.log("Transaction is done");
      showToast.success(`Payment successful! You paid ₹${displayPrice} for ${Product[idd].name}`);
      
      // Clear form after successful payment
      document.querySelector("#name").value = "";
      document.querySelector("#message").value = "Sending you love with this coffee ☕💕";
      localStorage.removeItem('coffeeCart');
      
    } catch (error) {
      console.error("Transaction failed:", error);
      
      if (error.message.includes("insufficient funds")) {
        showToast.error("Insufficient funds! Please add more ETH to your wallet to cover gas fees.");
      } else if (error.message.includes("rejected")) {
        showToast.warning("Transaction cancelled by user.");
      } else if (error.message.includes("gas")) {
        showToast.error("Gas estimation failed. Please try again or increase gas limit.");
      } else {
        showToast.error("Payment failed! Please check your wallet and try again.");
      }
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const param = useParams();
  const idd = param.id;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
            <img 
              src={Product[idd].imgSrc} 
              alt={Product[idd].name}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {Product[idd].name}
        </h1>
        <p className="text-center text-gray-600">Perfect for your loved one</p>
      </div>
      
      <div className="p-6">
        <form className="space-y-6" onSubmit={buycofee}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Name of beloved ❤️
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 text-lg"
              id="name"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Product Price
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-lg font-medium text-gray-600"
              id="price"
              value={`₹${Product[idd].price}`} 
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Love Message 💌
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 text-lg"
              id="message"
              defaultValue="Sending you love with this coffee ☕💕"
              placeholder="Enter a love message"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>💳</span>
              <span>Pay with MetaMask</span>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buy;
