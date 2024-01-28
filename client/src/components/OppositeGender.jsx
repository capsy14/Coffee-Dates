import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OppositeGenderProfiles = () => {
  // Assuming you have some dummy data for testing
  const dummyData = [
    {
      _id: 1,
      userName: "John Doe",
      gender: "Male",
      age: 25,
      photo: "john.jpg",
      email: "john@example.com",
    },
    // Add more dummy data as needed
  ];

  const [oppositeGenderProfiles, setOppositeGenderProfiles] =
    useState(dummyData);

  // Function to handle sending email (assuming you have an emailBhejo function)
  const emailBhejo = (profile) => {
    // Implement your email sending logic here
    console.log("Sending email to: ", profile.email);
  };

  return (
    <>
      <h2>Opposite Gender Profiles</h2>
      <div className="opposite-gender-profiles">
        {oppositeGenderProfiles.map((profile) => (
          <Link to="/opposite/email" key={profile._id}>
            <div
              className="profile-card"
              key={profile._id}
              onClick={() => emailBhejo(profile)}
            >
              <img src={profile.photo} alt={profile.userName} />
              <p>Name: {profile.userName}</p>
              <p>Gender: {profile.gender}</p>
              <p>Age: {profile.age}</p>
              <p>Id: {profile._id}</p>
              <p>Email: {profile.email}</p>
              {/* Add more profile information here */}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default OppositeGenderProfiles;
