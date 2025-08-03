import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Product from "./data.json";
import { showToast } from "../utils/toastUtils";

const BuyCoffee = () => {
  const param = useParams();
  const idd = param.id;
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add error handling for invalid product IDs
  const productIndex = parseInt(idd);
  const product = Product[productIndex];
  
  // Handle Buy Now functionality
  const handleBuyNow = () => {
    setIsProcessing(true);
    
    showToast.success(`Redirecting to payment for ${product.name}...`);
    
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect directly to wallet page for payment
      navigate(`/wallet/${productIndex}`);
    }, 1000);
  };
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECE4CF]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-4">Product Not Found</h1>
          <p className="text-[#8B4513] opacity-75">The product you're looking for doesn't exist.</p>
          <a href="/product" className="inline-block mt-4 px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-opacity-90">
            Back to Products
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#ECE4CF] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={product.imgSrc} 
                alt={product.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-[#8B4513] mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">({product.rating}/5)</span>
              </div>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-[#8B4513]">₹{product.price}</span>
              </div>
              
              <button 
                onClick={handleBuyNow}
                disabled={isProcessing}
                className={`w-full py-5 px-6 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 cursor-pointer'
                } text-white`}
                style={{background: isProcessing ? undefined : 'linear-gradient(to right, #DEB887, #CD853F)'}}
              >
                {isProcessing ? (
                  <>
                    <span className="inline-block animate-spin mr-3">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-3">💳</span>
                    Buy Now - ₹{product.price}
                  </>
                )}
              </button>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">☕</div>
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Direct Payment</h3>
                    <p className="text-amber-700 text-sm">
                      Click "Buy Now" to proceed directly to secure MetaMask payment. No cart needed!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCoffee;
