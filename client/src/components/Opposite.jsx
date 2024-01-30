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
        <div className=" mt-3">
          <div className="opposite-gender-profiles  ">
            {oppositeGender.map((profile) => (
              <Link to={`/opposite/${profile._id}`} key={profile._id}>
                <div
                  className="profile-card bg-[#e9e5db] "
                  key={profile._id}
                  onClick={() => emailBhejo(profile)}
                >
                  <div className=" rounded-xl overflow-hidden border-collapse">
                    <img src={profile.photo} alt={profile.userName} />
                  </div>
                  <table className="text-sm my-3 border-none border-collapse">
                    <tbody>
                      <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">
                          Name
                        </td>
                        <td className="px-2 py-2 text-2xl">{profile.name}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">
                          Gender
                        </td>
                        <td className="px-2 py-2 text-xl">{profile.gender}</td>
                      </tr>

                      {/* Add more profile information rows here */}
                      <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">
                          Email
                        </td>
                        <td className="px-2 py-2 text-xl">{profile.email}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">
                          Bio
                        </td>
                        <td className="px-2 py-2 text-lg">{profile.bio}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
