import React from "react";
import { Link } from "react-router-dom";
import { ShowOnLogin, ShowOnLogout } from "../protect/HiddenLink";

export default function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          {/* Main Heading */}
          <div className="hero-text-container">
            
            <h1 className="hero-title">
              Coffee Talks &
              <span className="hero-title-highlight"> Heartfelt Walks</span>
            </h1>
            
            <p className="hero-subtitle">
              Where meaningful connections brew over the perfect cup. 
              Discover your ideal coffee companion through AI-powered matching 
              and create unforgettable moments together.
            </p>
            
            {/* Action Buttons */}
            <div className="hero-actions">
              <ShowOnLogout>
                <Link to="/register" className="hero-btn-primary">
                  <span className="btn-icon">💕</span>
                  Start Your Journey
                </Link>
                <Link to="/login" className="hero-btn-secondary">
                  <span className="btn-icon">☕</span>
                  Sign In
                </Link>
              </ShowOnLogout>
              
              <ShowOnLogin>
                <Link to="/opposite" className="hero-btn-primary">
                  <span className="btn-icon">💕</span>
                  Browse Profiles
                </Link>
                <Link to="/product" className="hero-btn-secondary">
                  <span className="btn-icon">☕</span>
                  Buy Coffee
                </Link>
              </ShowOnLogin>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
