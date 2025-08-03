import React, { useState } from 'react';
import './MatchCard.css';

const MatchCard = ({ match, onAccept, onSkip }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { profile, score, reasons } = match;


  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatInterests = (interests) => {
    if (!interests || interests.length === 0) return [];
    return interests.slice(0, 6); // Limit to 6 interests
  };

  const formatCoffeePrefs = (coffeePrefs) => {
    if (!coffeePrefs || coffeePrefs.length === 0) return 'Coffee lover';
    return coffeePrefs.join(', ');
  };

  const getProfileImage = (profile) => {
    const defaultMaleImage = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
    const defaultFemaleImage = "https://icon2.cleanpng.com/lnd/20240714/aft/a81tg9lau.webp";
    
    if (profile.photo && profile.photo !== defaultMaleImage) {
      return profile.photo;
    }
    
    return profile.gender?.toLowerCase() === "male" ? defaultMaleImage : defaultFemaleImage;
  };

  return (
    <div className="match-card-container">
      <div className="match-card-layout">
        
        {/* Left Side - Photo */}
        <div className="match-card-photo">
          {!imageLoaded && !imageError && (
            <div className="loading-text">
              Loading...
            </div>
          )}
          <img 
            src={imageError ? '/default-avatar.png' : getProfileImage(profile)} 
            alt={profile.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="profile-image"
            style={{ 
              display: imageLoaded || imageError ? 'block' : 'none'
            }}
          />
          
          {/* Score Badge */}
          <div className="score-badge">
            {Math.round(score * 100)}% Match
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="match-card-details">
          
          {/* Header */}
          <div className="details-content">
            <h2 className="profile-name">
              {profile.name}, {profile.age}
            </h2>
            
            <div className="gradient-line" />

            {/* Bio */}
            {profile.bio && (
              <p className="profile-bio">
                "{profile.bio}"
              </p>
            )}

            {/* Details Grid */}
            <div className="details-grid">
              <div className="detail-card">
                <h4 className="detail-title">☕ Coffee Style</h4>
                <p className="detail-text">{formatCoffeePrefs(profile.coffee_preferences)}</p>
              </div>

              {profile.personality_type && (
                <div className="detail-card">
                  <h4 className="detail-title">🧠 Personality</h4>
                  <p className="detail-text">{profile.personality_type}</p>
                </div>
              )}
            </div>

            {/* Interests */}
            {formatInterests(profile.interests).length > 0 && (
              <div className="interests-section">
                <h4 className="section-title">🎯 Interests</h4>
                <div className="interests-tags">
                  {formatInterests(profile.interests).map((interest, index) => (
                    <span key={index} className="interest-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compatibility Reasons */}
            {reasons && reasons.length > 0 && (
              <div className="reasons-section">
                <h4 className="section-title">✨ Why you might click</h4>
                <ul className="reasons-list">
                  {reasons.map((reason, index) => (
                    <li key={index} className="reason-item">
                      <span className="reason-icon">💫</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={onSkip}
              className="pass-button"
            >
              <span className="button-icon">👎</span>
              Pass
            </button>
            
            <button 
              onClick={onAccept}
              className="coffee-button"
            >
              <span className="button-icon">☕</span>
              Coffee Date?
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .match-card-container {
          max-width: 1100px;
          margin: 20px auto;
          background-color: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(210, 180, 140, 0.3);
          border: 2px solid #D2B48C;
          overflow: visible;
          font-family: system-ui, -apple-system, sans-serif;
          height: auto;
          min-height: fit-content;
        }

        .match-card-layout {
          display: flex;
          flex-direction: row;
          min-height: auto;
          height: auto;
        }

        .match-card-photo {
          flex: 0 0 420px;
          position: relative;
          background-color: #D2B48C;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-height: 600px;
          max-height: 600px;
        }

        .loading-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 18px;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
        }

        .score-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 8px 16px;
          border-radius: 25px;
          border: 2px solid #D2B48C;
          font-weight: bold;
          color: #8B4513;
        }

        .match-card-details {
          flex: 1;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: visible;
          min-height: 600px;
        }

        .details-content {
          flex: 1;
          overflow: visible;
          height: auto;
          padding-bottom: 20px;
        }

        .profile-name {
          font-size: 28px;
          color: #8B4513;
          margin: 0 0 6px 0;
          font-weight: bold;
        }

        .gradient-line {
          height: 3px;
          background: linear-gradient(90deg, #D2B48C 0%, #F5DEB3 100%);
          border-radius: 2px;
          margin-bottom: 15px;
        }

        .profile-bio {
          font-size: 15px;
          color: #5D4E37;
          line-height: 1.5;
          margin-bottom: 18px;
          font-style: italic;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 18px;
        }

        .detail-card {
          background-color: #F5F5DC;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #D2B48C;
        }

        .detail-title {
          margin: 0 0 8px 0;
          color: #8B4513;
          font-size: 14px;
          font-weight: bold;
        }

        .detail-text {
          margin: 0;
          color: #5D4E37;
          font-size: 14px;
        }

        .interests-section, .reasons-section {
          margin-bottom: 18px;
        }

        .section-title {
          margin: 0 0 12px 0;
          color: #8B4513;
          font-size: 16px;
          font-weight: bold;
        }

        .interests-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .interest-tag {
          background: linear-gradient(135deg, #90EE90 0%, #D2B48C 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .reasons-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .reason-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          color: #5D4E37;
          font-size: 14px;
        }

        .reason-icon {
          margin-right: 8px;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(210, 180, 140, 0.2);
          flex-shrink: 0;
        }

        .pass-button, .coffee-button {
          flex: 1;
          padding: 15px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 2px solid #D2B48C;
        }

        .pass-button {
          background-color: white;
          color: #8B4513;
        }

        .pass-button:hover {
          background-color: #F5F5DC;
          transform: translateY(-2px);
        }

        .coffee-button {
          background-color: #D2B48C;
          color: white;
        }

        .coffee-button:hover {
          background-color: #C19A6B;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(210, 180, 140, 0.4);
        }

        .button-icon {
          font-size: 20px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .match-card-container {
            margin: 10px;
            height: auto;
            overflow: visible;
          }

          .match-card-layout {
            flex-direction: column;
            height: auto;
          }

          .match-card-photo {
            flex: none;
            min-height: 350px;
            max-height: 350px;
          }

          .match-card-details {
            padding: 24px;
            overflow: visible;
            height: auto;
            min-height: auto;
            justify-content: flex-start;
          }
          
          .details-content {
            overflow: visible;
            height: auto;
            flex: none;
          }

          .profile-name {
            font-size: 22px;
            margin-bottom: 4px;
          }

          .gradient-line {
            margin-bottom: 12px;
          }

          .profile-bio {
            font-size: 14px;
            margin-bottom: 15px;
          }

          .details-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 15px;
          }

          .interests-section, .reasons-section {
            margin-bottom: 15px;
          }

          .section-title {
            font-size: 15px;
            margin-bottom: 8px;
          }

          .detail-card {
            padding: 10px;
          }
        }

        @media (max-width: 480px) {
          .match-card-container {
            margin: 8px;
            overflow: visible;
          }

          .match-card-photo {
            min-height: 300px;
            max-height: 300px;
          }

          .match-card-details {
            padding: 20px;
            overflow: visible;
            height: auto;
          }
          
          .details-content {
            overflow: visible;
            height: auto;
          }

          .profile-name {
            font-size: 20px;
            margin-bottom: 3px;
          }

          .gradient-line {
            margin-bottom: 10px;
          }

          .profile-bio {
            font-size: 13px;
            margin-bottom: 12px;
          }

          .details-grid {
            gap: 10px;
            margin-bottom: 12px;
          }

          .interests-section, .reasons-section {
            margin-bottom: 12px;
          }

          .section-title {
            font-size: 14px;
            margin-bottom: 6px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default MatchCard;