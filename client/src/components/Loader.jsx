import React from "react";
import ReactDOM from "react-dom";
import { Grid } from "react-loader-spinner";

export const Loader = () => {
  return (
    <div className="min-h-screen bg-[#ECE4CF] flex flex-col justify-center items-center">
      <div className="coffee-loader-container">
        <Grid
          visible={true}
          height="120"
          width="120"
          color="#8B4513"
          ariaLabel="coffee-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="coffee-grid-wrapper"
        />
        <div className="coffee-loading-text">
          <h2 className="text-2xl font-bold text-[#8B4513] mb-2">☕ Brewing...</h2>
          <p className="text-[#8B4513] opacity-75">Preparing your coffee dating experience</p>
        </div>
      </div>
      
      <style>{`
        .coffee-loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        
        .coffee-grid-wrapper {
          filter: drop-shadow(0 4px 8px rgba(139, 69, 19, 0.2));
        }
        
        .coffee-loading-text {
          text-align: center;
          animation: fade-pulse 2s ease-in-out infinite;
        }
        
        @keyframes fade-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .coffee-loader-container::before {
          content: '☕';
          position: absolute;
          font-size: 3rem;
          animation: float 3s ease-in-out infinite;
          margin-top: -8rem;
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) rotate(5deg); 
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
