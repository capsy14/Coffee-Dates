import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/services";
import { showToast } from "../utils/toastUtils";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME, SET_USER } from "../redux/slice/userSlice";
import ImageIcon from "./ImageIcon";
const initialState = {
  name: "",
  email: "",
  gender: "",
  photo: "",
  password: "",
  confirm_password: "",
  age: 25,
  interests: ["Coffee", "Reading", "Movies"],
  personality: "Friendly and outgoing",
};
export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [image, setImage] = useState();
  const [photoLink, setPhotoLink] = useState();
  const [formData, setFormData] = useState(initialState);
  const { email, password, name, gender, confirm_password, photo, age, interests, personality } = formData;
  const [newInterest, setNewInterest] = useState("");
  
  const interestSuggestions = [
    "Coffee", "Reading", "Movies", "Music", "Travel", "Photography", 
    "Cooking", "Hiking", "Art", "Fitness", "Gaming", "Dancing"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
      setNewInterest("");
    }
  };
  
  const removeInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return showToast.error("All fields are required");
    }
    if (password.length < 6) {
      return showToast.error("Passwords must be up to 6 characters");
    }

    if (password !== confirm_password) {
      return showToast.error("Passwords do not match");
    }
    try {
      setFormData((prevFormData) => ({ ...prevFormData, photo: photoLink }));
      console.log(formData); // This might still log the previous state
      console.log(photoLink); // This should log the correct photoLink
      const data = { name, email, password, gender, photo: photoLink, age, interests, personality };
      console.log(data);
      const response = await registerUser(data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(response.user.name));
      await dispatch(SET_USER(response.user));
      navigate("/product");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE4CF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#DEB887]/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#DEB887] to-[#CD853F] px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">
              ☕ Join Coffee Dates
            </h2>
            <p className="text-center text-white/90 mt-2">
              Create your coffee dating profile
            </p>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#DEB887] shadow-lg">
                  <img
                    src={
                      photoLink
                        ? photoLink
                        : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                    }
                    className="w-full h-full object-cover"
                    alt="Profile picture"
                  />
                </div>
                <div className="absolute bottom-0 right-0">
                  <ImageIcon photoLink={photoLink} setPhotoLink={setPhotoLink} />
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={gender}
                  onChange={handleChange}
                  id="gender"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={age}
                  onChange={handleChange}
                  id="age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                  placeholder="Your age"
                  min="18"
                  max="100"
                  required
                />
              </div>
            </div>

            {/* Personality */}
            <div>
              <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-2">
                Personality Description
              </label>
              <textarea
                name="personality"
                value={personality}
                onChange={handleChange}
                id="personality"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                placeholder="Describe your personality (e.g., Friendly and outgoing)"
                rows={3}
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests & Hobbies
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <div key={index} className="bg-[#DEB887] text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                      {interest}
                      <button
                        type="button"
                        className="hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                  placeholder="Add an interest and press Enter"
                />
                <div className="flex flex-wrap gap-2">
                  {interestSuggestions
                    .filter(suggestion => !interests.includes(suggestion))
                    .slice(0, 8)
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="bg-gray-100 hover:bg-[#DEB887] hover:text-white text-gray-700 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                        onClick={() => addInterest(suggestion)}
                      >
                        + {suggestion}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  id="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={confirm_password}
                  onChange={handleChange}
                  id="confirm_password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#DEB887] hover:bg-[#CD853F] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DEB887]"
            >
              Create My Coffee Profile
            </button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-[#DEB887] hover:text-[#CD853F] transition-colors duration-200"
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
