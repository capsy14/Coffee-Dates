import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OppositeGenderProfiles = ({
  sex,
  setSex,
  reName,
  setReName,
  reEmail,
  setReEmail,
}) => {
  const [oppositeGenderProfiles, setOppositeGenderProfiles] = useState([]);

  useEffect(() => {
    const fetchOppositeGenderProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users");
        // Change the API endpoint accordingly
        // console.log(response);
        // toast.success(`${sex}`);
        console.log(res.data.allUsers);
        const oppositeProfiles = res.data.allUsers.filter(
          (profile) => profile.gender != sex
        );
        setOppositeGenderProfiles(oppositeProfiles);
        console.log(oppositeGenderProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchOppositeGenderProfiles();
  }, [sex]);
  const emailBhejo = (p) => {
    // console.log(p.userName);
    // console.log(p.email);
    setReName(p.userName);
    setReEmail(p.email);
  };
  return (
    <>
      <h2>Opposite Gender Profiles</h2>
      <div className="opposite-gender-profiles">
        {oppositeGenderProfiles.map((profile) => (
          <Link
            to="/opposite/email" // Navigate to the email page
            key={profile._id}
          >
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
