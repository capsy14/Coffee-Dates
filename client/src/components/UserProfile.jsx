import React, { useEffect, useState } from "react";
import { getUser, logOut } from "../services/services";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectName } from "../redux/slice/userSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";
import "./UserProfile.css";

export default function UserProfile() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const namee = useSelector(selectName);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    gender: "",
    age: 25,
    coffeePreferences: ["Espresso", "Americano"],
    interests: ["Coffee", "Reading", "Movies"],
    personality: "Friendly and outgoing",
    matches: [],
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getUser();
        // console.log("this is res ", res);
        // console.log(res?.name); // Using optional chaining to avoid undefined errors
        if (!res) {
          toast.error("Some error occurred");
          navigate("/login");
          window.location.reload();
        } else {
          // console.log("checking ", res);
          setUserData(res);
          setLoading(false);
        }
        // console.log(res);
      } catch (error) {
        console.error(error);
        navigate("/login");
        window.location.reload();
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  const logOutUser = async () => {
    try {
      localStorage.setItem("isLoggedIn", false);
      await logOut();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const { 
    name, 
    email, 
    phone, 
    bio, 
    photo, 
    gender, 
    age, 
    coffeePreferences, 
    interests, 
    personality, 
    matches 
  } = userData;

  return (
    <div className="profile-container">
      {loading ? (
        <div className="profile-loading">
          <div className="loading-spinner">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : (
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <h1>
              <span>👤</span>
              My Coffee Profile
            </h1>
            <p>Your coffee dating companion profile</p>
          </div>

          {/* Profile Avatar Section */}
          <div className="profile-avatar-section">
            <img
              src={
                photo ||
                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
              }
              alt="Profile Avatar"
              className="profile-avatar"
            />
            <h2 className="profile-name">{name || "Coffee Lover"}</h2>
            <div className="profile-status">
              <span>☕</span>
              <span>Ready for Coffee Dates</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            {/* Basic Info Grid */}
            <div className="profile-info-grid">
              <div className="profile-info-card">
                <div className="info-card-header">
                  <span className="info-card-icon">📧</span>
                  <h3 className="info-card-title">Email</h3>
                </div>
                <div className="info-card-content">{email || "Not provided"}</div>
              </div>

              <div className="profile-info-card">
                <div className="info-card-header">
                  <span className="info-card-icon">📱</span>
                  <h3 className="info-card-title">Phone</h3>
                </div>
                <div className="info-card-content">{phone || "Not provided"}</div>
              </div>

              <div className="profile-info-card">
                <div className="info-card-header">
                  <span className="info-card-icon">👤</span>
                  <h3 className="info-card-title">Gender</h3>
                </div>
                <div className="info-card-content">{gender || "Not specified"}</div>
              </div>

              <div className="profile-info-card">
                <div className="info-card-header">
                  <span className="info-card-icon">🎂</span>
                  <h3 className="info-card-title">Age</h3>
                </div>
                <div className="info-card-content">{age || 25} years old</div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="profile-bio">
              <div className="bio-header">
                <span className="info-card-icon">📝</span>
                <h3 className="bio-title">About Me</h3>
              </div>
              <div className="bio-content">
                "{bio || "Hello! I'm interested in coffee dates and meeting new people."}"
              </div>
            </div>

            {/* Preferences and Interests */}
            <div className="profile-preferences">
              <div className="preference-section">
                <h3 className="preference-title">
                  <span>☕</span>
                  Coffee Preferences
                </h3>
                <div className="tags-container">
                  {(coffeePreferences || ["Espresso", "Americano"]).map((pref, index) => (
                    <span key={index} className="tag">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="preference-section">
                <h3 className="preference-title">
                  <span>🎯</span>
                  Interests
                </h3>
                <div className="tags-container">
                  {(interests || ["Coffee", "Reading", "Movies"]).map((interest, index) => (
                    <span key={index} className="tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Personality */}
            <div className="profile-info-card">
              <div className="info-card-header">
                <span className="info-card-icon">🌟</span>
                <h3 className="info-card-title">Personality</h3>
              </div>
              <div className="info-card-content">
                {personality || "Friendly and outgoing"}
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <h3 className="stat-number">{(matches || []).length}</h3>
              <p className="stat-label">Coffee Matches</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">{(interests || []).length}</h3>
              <p className="stat-label">Interests</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">{(coffeePreferences || []).length}</h3>
              <p className="stat-label">Coffee Types</p>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="profile-actions">
            <Link to="/profile/edit" className="profile-btn profile-btn-primary">
              <span>✏️</span>
              Edit Profile
            </Link>
            <button
              className="profile-btn profile-btn-secondary"
              onClick={() => navigate("/ml-matches")}
            >
              <span>🤖</span>
              AI Matches
            </button>
            <button
              className="profile-btn profile-btn-danger"
              onClick={logOutUser}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
