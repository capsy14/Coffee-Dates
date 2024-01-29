import React, { useEffect, useState } from "react";
import { oppositeGenderProfile } from "../services/services";
import { Link } from "react-router-dom";

export default function Opposite() {
  const [oppositeGender, setOppositeGender] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await oppositeGenderProfile();
        setOppositeGender(res);
        console.log("Data from API:", res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    console.log("Updated oppositeGender state:", oppositeGender);
  }, [oppositeGender]);

  return (
    <div>
      {oppositeGender && (
        <>
          <h2>Opposite Gender Profiles</h2>
          <div className="opposite-gender-profiles">
            {oppositeGender.map((profile) => (
              <Link to={`/opposite/${profile._id}`} key={profile._id}>
                <div
                  className="profile-card"
                  key={profile._id}
                  onClick={() => emailBhejo(profile)}
                >
                  <img src={profile.photo} alt={profile.userName} />
                  <p>Name: {profile.name}</p>
                  <p>Gender: {profile.gender}</p>
                  <p>Age: {profile.age}</p>
                  <p>Id: {profile._id}</p>
                  <p>Email: {profile.email}</p>
                  <p>Bio: {profile.bio}</p>
                  {/* Add more profile information here */}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
