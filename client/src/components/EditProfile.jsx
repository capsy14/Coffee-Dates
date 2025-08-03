import React, { useEffect, useState } from "react";
import { getUser, updateProfile } from "../services/services";
import ImageIcon from "./ImageIcon";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    gender: "",
    age: 25,
    coffeePreferences: [],
    interests: [],
    personality: "",
  });
  const [photoLink, setPhotoLink] = useState();
  const [newInterest, setNewInterest] = useState("");
  const [newCoffeePreference, setNewCoffeePreference] = useState("");
  
  const interestSuggestions = [
    "Coffee", "Reading", "Movies", "Music", "Travel", "Photography", 
    "Cooking", "Hiking", "Art", "Fitness", "Gaming", "Dancing"
  ];
  
  const coffeeSuggestions = [
    "Espresso", "Americano", "Latte", "Cappuccino", "Mocha", "Macchiato",
    "Cold Brew", "Frappé", "Turkish Coffee", "French Press", "Flat White"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser();
        if (!res) {
          toast.error("Some error occurred");
        } else {
          setUserData({
            ...res,
            coffeePreferences: res.coffeePreferences || ["Espresso", "Americano"],
            interests: res.interests || ["Coffee", "Reading", "Movies"],
            personality: res.personality || "Friendly and outgoing",
            age: res.age || 25,
            gender: res.gender || "",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  
  const addInterest = (interest) => {
    if (interest && !(userData.interests || []).includes(interest)) {
      setUserData({
        ...userData,
        interests: [...(userData.interests || []), interest]
      });
      setNewInterest("");
    }
  };
  
  const removeInterest = (interestToRemove) => {
    setUserData({
      ...userData,
      interests: (userData.interests || []).filter(interest => interest !== interestToRemove)
    });
  };
  
  const addCoffeePreference = (preference) => {
    if (preference && !(userData.coffeePreferences || []).includes(preference)) {
      setUserData({
        ...userData,
        coffeePreferences: [...(userData.coffeePreferences || []), preference]
      });
      setNewCoffeePreference("");
    }
  };
  
  const removeCoffeePreference = (preferenceToRemove) => {
    setUserData({
      ...userData,
      coffeePreferences: (userData.coffeePreferences || []).filter(pref => pref !== preferenceToRemove)
    });
  };

  const editProfile = async (e) => {
    e.preventDefault();
    // Update formData.photo with photoLink if photoLink is available
    const updatedData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      photo: photoLink || userData.photo,
      gender: userData.gender,
      age: userData.age,
      coffeePreferences: userData.coffeePreferences,
      interests: userData.interests,
      personality: userData.personality,
    };
    // console.log(updatedData);

    // Call the updateProfile function with updatedData
    const profile = await updateProfile(updatedData);

    if (profile) {
      navigate("/profile");
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        {/* Header */}
        <div className="edit-profile-header">
          <h1>
            <span>✏️</span>
            Edit Coffee Profile
          </h1>
          <p>Update your coffee dating companion profile</p>
        </div>

        {/* Avatar Section */}
        <div className="edit-avatar-section">
          <div className="avatar-container">
            <img
              src={photoLink ? photoLink : userData.photo || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"}
              alt="Profile Avatar"
              className="edit-avatar"
            />
            <div className="avatar-edit-icon">
              <ImageIcon photoLink={photoLink} setPhotoLink={setPhotoLink} />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="edit-form-content">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <span>👤</span>
                Basic Information
              </h3>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  id="name"
                  className="form-input"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  id="email"
                  className="form-input"
                  placeholder="example@example.com"
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  id="phone"
                  className="form-input"
                  placeholder="Phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  id="gender"
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age" className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                  id="age"
                  className="form-input"
                  placeholder="Your age"
                  min="18"
                  max="100"
                />
              </div>
            </div>

            {/* Personality & Bio */}
            <div className="form-section">
              <h3 className="section-title">
                <span>🌟</span>
                Personality & Bio
              </h3>
              
              <div className="form-group">
                <label htmlFor="bio" className="form-label">Bio</label>
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  id="bio"
                  className="form-input form-textarea"
                  placeholder="Tell something about yourself"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="personality" className="form-label">Personality</label>
                <textarea
                  name="personality"
                  value={userData.personality}
                  onChange={handleChange}
                  id="personality"
                  className="form-input form-textarea"
                  placeholder="Describe your personality"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Coffee Preferences */}
          <div className="form-section">
            <h3 className="section-title">
              <span>☕</span>
              Coffee Preferences
            </h3>
            
            <div className="form-group">
              <label className="form-label">Your Coffee Types</label>
              <div className="multi-select-container">
                <div className="tags-display">
                  {(userData.coffeePreferences || []).map((pref, index) => (
                    <div key={index} className="tag-item">
                      {pref}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeCoffeePreference(pref)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={newCoffeePreference}
                  onChange={(e) => setNewCoffeePreference(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCoffeePreference(newCoffeePreference);
                    }
                  }}
                  className="tag-input"
                  placeholder="Add coffee preference"
                />
                <div className="tag-suggestions">
                  {coffeeSuggestions
                    .filter(suggestion => 
                      !(userData.coffeePreferences || []).includes(suggestion) &&
                      suggestion.toLowerCase().includes(newCoffeePreference.toLowerCase())
                    )
                    .slice(0, 6)
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="tag-suggestion"
                        onClick={() => addCoffeePreference(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="form-section">
            <h3 className="section-title">
              <span>🎯</span>
              Interests & Hobbies
            </h3>
            
            <div className="form-group">
              <label className="form-label">Your Interests</label>
              <div className="multi-select-container">
                <div className="tags-display">
                  {(userData.interests || []).map((interest, index) => (
                    <div key={index} className="tag-item">
                      {interest}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeInterest(interest)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest(newInterest);
                    }
                  }}
                  className="tag-input"
                  placeholder="Add interest"
                />
                <div className="tag-suggestions">
                  {interestSuggestions
                    .filter(suggestion => 
                      !(userData.interests || []).includes(suggestion) &&
                      suggestion.toLowerCase().includes(newInterest.toLowerCase())
                    )
                    .slice(0, 6)
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="tag-suggestion"
                        onClick={() => addInterest(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="form-btn form-btn-secondary"
            onClick={() => navigate("/profile")}
          >
            <span>❌</span>
            Cancel
          </button>
          <button
            type="submit"
            className="form-btn form-btn-primary"
            onClick={editProfile}
          >
            <span>💾</span>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
