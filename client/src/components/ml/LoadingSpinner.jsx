import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner-container">
      <div className="coffee-loading">
        <div className="coffee-cup">
          <div className="coffee-liquid"></div>
          <div className="coffee-steam">
            <div className="steam-line steam-1"></div>
            <div className="steam-line steam-2"></div>
            <div className="steam-line steam-3"></div>
          </div>
        </div>
      </div>
      <p className="loading-message">{message}</p>
      <div className="dots-loading">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;