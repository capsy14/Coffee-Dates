import React from "react";
import { Link } from "react-router-dom";
import { ShowOnLogin, ShowOnLogout } from "../protect/HiddenLink";

export default function Banner() {
  return (
    <section className="coffee-mate-section">
      <div className="coffee-mate-overlay">
        <div className="coffee-mate-container">
          <div className="coffee-mate-content">
            <div className="coffee-mate-badge">
              <span className="badge-icon">💕</span>
              <span className="badge-text">Coffee Dating</span>
            </div>
            
            <h2 className="coffee-mate-title">
              <span className="title-hindi">Ab Apna Chakker Chalau</span>
              <span className="title-english">Start Your Coffee Journey</span>
            </h2>
            
            <p className="coffee-mate-subtitle">
              Seek a coffee mate, spark delightful conversations, and create meaningful connections 
              over the perfect cup of coffee. Your ideal match is just a brew away!
            </p>
            
            
            <div className="coffee-mate-actions">
              <ShowOnLogout>
                <Link to="/register" className="cta-primary">
                  <span className="btn-icon">🚀</span>
                  <span className="btn-text">Start Dating</span>
                </Link>
                <Link to="/product" className="cta-secondary">
                  <span className="btn-icon">☕</span>
                  <span className="btn-text">Browse Coffee</span>
                </Link>
              </ShowOnLogout>
              
              <ShowOnLogin>
                <Link to="/opposite" className="cta-primary">
                  <span className="btn-icon">💕</span>
                  <span className="btn-text">Find Your Match</span>
                </Link>
                <Link to="/product" className="cta-secondary">
                  <span className="btn-icon">☕</span>
                  <span className="btn-text">Order Coffee</span>
                </Link>
              </ShowOnLogin>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
