import React, { useState } from 'react';
import { toast } from 'react-toastify';
import WebRTCVideoCall from '../../component-d/WebRTCVideoCall';
import './HomeWebRTC.css';

/**
 * WebRTC Coffee Dates Video Call Page
 * Clean implementation without Huddle dependencies
 */
const HomeWebRTC = () => {
  // Get user ID from localStorage or use a temp ID
  const [currentUserId] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) return storedUserId;
    
    // Generate temporary ID if not logged in
    const tempId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return tempId;
  });

  const [recipientId, setRecipientId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [showCallInterface, setShowCallInterface] = useState(false);

  const handleStartCall = () => {
    if (!recipientId || !recipientName) {
      toast.error('Please enter recipient ID and name');
      return;
    }

    if (recipientId === currentUserId) {
      toast.error('You cannot call yourself!');
      return;
    }

    setShowCallInterface(true);
    toast.success(`Initiating call with ${recipientName}`);
  };

  const handleEndCall = () => {
    setShowCallInterface(false);
    setRecipientId('');
    setRecipientName('');
  };

  if (showCallInterface) {
    return (
      <div className="home-webrtc-wrapper">
        <WebRTCVideoCall
          currentUserId={currentUserId}
          recipientUserId={recipientId}
          recipientName={recipientName}
        />
        <div className="back-button-container">
          <button onClick={handleEndCall} className="btn-back">
            ← Back to Call Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-webrtc-container">
      <div className="call-setup-card">
        <div className="card-header-setup">
          <h1 className="setup-title">☕ Coffee Date Video Call</h1>
          <p className="setup-subtitle">
            Connect face-to-face with your coffee companion
          </p>
        </div>

        <div className="card-body-setup">
          <div className="user-info-section">
            <div className="info-badge">
              <span className="info-icon">👤</span>
              <div className="info-content">
                <span className="info-label">Your ID:</span>
                <span className="info-value">{currentUserId}</span>
              </div>
            </div>
            <p className="info-hint">
              Share this ID with someone to receive calls
            </p>
          </div>

          <div className="divider">
            <span>Start a Call</span>
          </div>

          <div className="input-section">
            <div className="input-group-setup">
              <label className="input-label-setup">
                <span className="label-icon">🆔</span>
                Recipient's User ID
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter the person's user ID"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
              />
              <p className="input-hint">
                Ask your coffee date for their user ID
              </p>
            </div>

            <div className="input-group-setup">
              <label className="input-label-setup">
                <span className="label-icon">✨</span>
                Recipient's Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter their name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <p className="input-hint">
                This will be displayed during the call
              </p>
            </div>
          </div>

          <button
            onClick={handleStartCall}
            className="btn-start-setup"
            disabled={!recipientId || !recipientName}
          >
            <span className="btn-icon-setup">📞</span>
            Start Video Call
          </button>
        </div>

        <div className="card-footer-setup">
          <div className="feature-list">
            <div className="feature-item">
              <span>✅</span>
              <span>Peer-to-peer video calling</span>
            </div>
            <div className="feature-item">
              <span>✅</span>
              <span>High-quality audio & video</span>
            </div>
            <div className="feature-item">
              <span>✅</span>
              <span>Secure WebRTC connection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Share Your ID</h3>
            <p className="step-description">
              Copy your user ID above and share it with your coffee date
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Get Their ID</h3>
            <p className="step-description">
              Ask them to share their user ID with you
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Start the Call</h3>
            <p className="step-description">
              Enter their ID and name, then click "Start Video Call"
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3 className="step-title">Enjoy!</h3>
            <p className="step-description">
              Connect face-to-face and enjoy your virtual coffee date
            </p>
          </div>
        </div>
      </div>

      <div className="tech-info-section">
        <h3 className="tech-title">🔒 Powered by WebRTC</h3>
        <p className="tech-description">
          Your video calls use peer-to-peer WebRTC technology for secure,
          high-quality connections. Media streams are transmitted directly
          between you and your call partner, ensuring privacy and low latency.
        </p>
      </div>
    </div>
  );
};

export default HomeWebRTC;
