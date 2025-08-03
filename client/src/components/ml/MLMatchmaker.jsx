import React, { useState, useEffect } from 'react';
import MatchSuggestions from './MatchSuggestions';
import './MLMatchmaker.css';

const MLMatchmaker = ({ account, seName, seEmail }) => {
  const [userId, setUserId] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    ageRange: { min: 18, max: 35 },
    maxDistance: 25,
    coffeeTypes: [],
    interests: []
  });

  useEffect(() => {
    // Generate or get user ID based on account/wallet
    if (account) {
      // Use wallet address as user ID or map to existing user
      setUserId(account);
    } else if (seName) {
      // Use name as fallback identifier
      setUserId(`user_${seName.replace(/\s+/g, '_').toLowerCase()}`);
    } else {
      // Generate a temporary ID for demo purposes
      const tempId = localStorage.getItem('tempUserId') || `temp_user_${Date.now()}`;
      localStorage.setItem('tempUserId', tempId);
      setUserId(tempId);
    }
  }, [account, seName]);

  const handlePreferencesUpdate = (newPreferences) => {
    setUserPreferences(newPreferences);
  };

  if (!userId) {
    return (
      <div className="ml-matchmaker-container">
        <div className="ml-not-available">
          <h2>🤖 AI Matchmaker</h2>
          <p>Setting up your AI-powered match suggestions...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-matchmaker-container">
      {/* <div className="ml-header">
        <div className="ml-title">
          <h1>🤖 AI Matchmaker</h1>
          <p>Powered by machine learning to find your perfect coffee companion</p>
        </div>
      </div> */}

      <div className="ml-content">
        <div className="ml-info-card">
          <h3>How it works</h3>
          <div className="info-steps">
            <div className="info-step">
              <span className="step-icon">🧠</span>
              <span>Analyzes your preferences and behavior</span>
            </div>
            <div className="info-step">
              <span className="step-icon">🔄</span>
              <span>Learns from your interactions</span>
            </div>
            <div className="info-step">
              <span className="step-icon">💕</span>
              <span>Suggests compatible matches</span>
            </div>
          </div>
        </div>

        <MatchSuggestions userId={userId} />
      </div>
      <div className="ml-footer">
        <div className="privacy-note">
          <span className="privacy-icon">🔒</span>
          <span>Your privacy is protected. We use advanced privacy-preserving ML techniques.</span>
        </div>
      </div>
    </div>
  );
};

export default MLMatchmaker;