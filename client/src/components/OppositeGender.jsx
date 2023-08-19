import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OppositeGenderProfiles = ({ sex, setSex }) => {
  const [oppositeGenderProfiles, setOppositeGenderProfiles] = useState([]);

  useEffect(() => {
    const fetchOppositeGenderProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users");
        // Change the API endpoint accordingly
        // console.log(response);
        toast.success(`${sex}`);
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

  return (
    <>
      <h2>Opposite Gender Profiles</h2>
      <div className="opposite-gender-profiles">
        {oppositeGenderProfiles.map((profile) => (
          <div className="profile-card" key={profile._id}>
            <img src={profile.photo} alt={profile.userName} />
            <p>Name: {profile.userName}</p>
            <p>Gender: {profile.gender}</p>
            <p>Age: {profile.age}</p>
            <p>Email: {profile.email}</p>
            {/* Add more profile information here */}
          </div>
        ))}
      </div>
    </>
  );
};

export default OppositeGenderProfiles;
