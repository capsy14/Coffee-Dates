import React, { useEffect, useState } from "react";
import { oppositeGenderProfile, getUser, addMatch, removeMatch } from "../services/services";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import {
  setReceiver,
  setReceiverEmail,
  setReceiverPhoto,
  setReceiverName,
} from "../redux/slice/receiverSlice";

export default function Opposite() {
  const navigate = useNavigate();
  const [oppositeGender, setOppositeGender] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const defaultMaleImage =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
  const defaultFemaleImage =
    "https://icon2.cleanpng.com/lnd/20240714/aft/a81tg9lau.webp";

  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current user data to check matches
        const currentUser = await getUser();
        setCurrentUserData(currentUser);
        
        const res = await oppositeGenderProfile();
        setOppositeGender(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProfileImage = (p) => {
    if (p.photo && p.photo !== defaultMaleImage) {
      return p.photo;
    }
    return p.gender.toLowerCase() === "male"
      ? defaultMaleImage
      : defaultFemaleImage;
  };

  const handleSetReceiver = (p) => {
    if (!p) {
      console.warn("setReceiver was called with an undefined or null object");
      return;
    }

    dispatch(setReceiver(p._id));
    dispatch(setReceiverName(p.name));
    dispatch(setReceiverEmail(p.email));
    dispatch(setReceiverPhoto(getProfileImage(p)));
    navigate("/chat");
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Check if user is matched
  const isMatched = (userId) => {
    return currentUserData?.matches?.includes(userId) || false;
  };

  // Handle adding/removing matches
  const handleMatchToggle = async (profileId) => {
    try {
      if (isMatched(profileId)) {
        // Remove match
        await removeMatch(profileId);
        setCurrentUserData(prev => ({
          ...prev,
          matches: prev.matches.filter(id => id !== profileId)
        }));
      } else {
        // Add match
        await addMatch(profileId);
        setCurrentUserData(prev => ({
          ...prev,
          matches: [...(prev.matches || []), profileId]
        }));
      }
    } catch (error) {
      console.error("Error toggling match:", error);
    }
  };

  return (
    <div className="profiles-page">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="profiles-header">
            <div className="profiles-header-content">
              <div className="profiles-badge">
                <span className="profiles-icon">💕</span>
                <span className="profiles-text">Coffee Matches</span>
              </div>
              <h1 className="profiles-title">Discover Your Perfect Coffee Companion</h1>
              <p className="profiles-subtitle">
                Connect with amazing people who share your passion for coffee and meaningful conversations
              </p>
            </div>
          </div>

          <div className="profiles-container">
            <div className="profiles-grid">
              {oppositeGender && oppositeGender.length > 0 ? (
                oppositeGender.map((profile) => (
                  <div className="profile-card-modern" key={profile._id}>
                    <div className="profile-image-container">
                      <img
                        src={getProfileImage(profile)}
                        alt={profile.name}
                        className="profile-image-modern"
                      />
                      <div className="profile-overlay">
                        <div className="profile-status online">
                          <span className="status-dot"></span>
                          <span className="status-text">Available</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-content">
                      <div className="profile-header-section">
                        <h3 className="profile-name">{profile.name}</h3>
                        <div className="profile-meta">
                          <span className="profile-age">{calculateAge(profile.birthDate) || "25"}</span>
                          <span className="profile-separator">•</span>
                          <span className="profile-gender">{profile.gender}</span>
                        </div>
                      </div>

                      <div className="profile-bio-section">
                        <p className="profile-bio">
                          {profile.bio || "Coffee enthusiast looking for meaningful connections over great conversations."}
                        </p>
                      </div>

                      <div className="profile-details">
                        <div className="detail-item">
                          <span className="detail-icon">📧</span>
                          <span className="detail-text">{profile.email}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">☕</span>
                          <span className="detail-text">Coffee Lover</span>
                        </div>
                      </div>

                      <div className="profile-actions">
                        <button
                          className={`action-btn ${isMatched(profile._id) ? 'matched' : 'secondary'}`}
                          onClick={() => handleMatchToggle(profile._id)}
                        >
                          <span className="btn-icon">{isMatched(profile._id) ? '💕' : '🤍'}</span>
                          <span className="btn-text">{isMatched(profile._id) ? 'Matched' : 'Like'}</span>
                        </button>
                        
                        <button
                          className="action-btn primary"
                          onClick={() => handleSetReceiver(profile)}
                        >
                          <span className="btn-icon">💬</span>
                          <span className="btn-text">Start Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-profiles">
                  <div className="no-profiles-icon">☕</div>
                  <h3 className="no-profiles-title">No Matches Found</h3>
                  <p className="no-profiles-text">
                    Complete your profile to discover amazing coffee companions!
                  </p>
                  <Link to="/profile" className="no-profiles-btn">
                    <span className="btn-icon">👤</span>
                    <span className="btn-text">Complete Profile</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}