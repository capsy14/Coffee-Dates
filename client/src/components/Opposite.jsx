import React, { useEffect, useState } from "react";
import { oppositeGenderProfile } from "../services/services";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import {
  setReceiver,
  setReceiverEmail,
  setReceiverPhoto,
  setReceiverName,
} from "../redux/slice/receiverSlice";
import chatImage from "../../public/messenger.png";
export default function Opposite() {
  const navigate = useNavigate();
  const [oppositeGender, setOppositeGender] = useState([]);
  const [loading, setLoading] = useState(false);
  const defaultMaleImage =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
  const defaultFemaleImage =
    "https://icon2.cleanpng.com/lnd/20240714/aft/a81tg9lau.webp";

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await oppositeGenderProfile();
        setOppositeGender(res);
        // console.log("Data from API:", res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    // console.log("Updated oppositeGender state:", oppositeGender);
  }, [oppositeGender]);
  const getProfileImage = (p) => {
    // If custom photo is provided and it's not the default male image
    if (p.photo && p.photo !== defaultMaleImage) {
      return p.photo;
    }

    // If photo is default male image or not provided, check gender
    return p.gender.toLowerCase() === "male"
      ? defaultMaleImage
      : defaultFemaleImage;
  };
  const handleSetReceiver = (p) => {
    if (!p) {
      console.warn("setReceiver was called with an undefined or null object");
      return;
    }

    // console.log(p._id);
    dispatch(setReceiver(p._id));
    dispatch(setReceiverName(p.name));
    dispatch(setReceiverEmail(p.email));
    dispatch(setReceiverPhoto(getProfileImage(p)));
    navigate("/chat");
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className=" mt-3">
          <div className="opposite-gender-profiles  ">
            {oppositeGender &&
              oppositeGender.map((profile) => (
                <>
                  <div
                    className="profile-card bg-[#e9e5db] "
                    key={profile._id}
                    onClick={() => emailBhejo(profile)}
                  >
                    <div className=" rounded-xl overflow-hidden border-collapse">
                      <img
                        src={getProfileImage(profile)}
                        alt={profile.userName}
                        style={{
                          maxHeight: "300px",
                          objectFit: "cover",
                        }}
                      />
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
                          <td className="px-2 py-2 text-xl">
                            {profile.gender}
                          </td>
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
                    <div className="flex justify-evenly items-center">
                      <Link to={`/opposite/${profile._id}`} key={profile._id}>
                        <button>Send Mail</button>
                      </Link>
                      <button
                        className="bg-green-400 flex items-center"
                        onClick={() => handleSetReceiver(profile)}
                      >
                        Chat
                        <img
                          src={chatImage}
                          alt=""
                          style={{
                            width: "21px",
                            height: "21px",
                            marginLeft: "8px",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
