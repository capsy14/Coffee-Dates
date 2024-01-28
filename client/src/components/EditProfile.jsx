import React, { useEffect, useState } from "react";
import { getUser, updateProfile } from "../services/services";
import ImageIcon from "./ImageIcon";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
  });
  const [photoLink, setPhotoLink] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser();
        if (!res) {
          toast.error("Some error occurred");
        } else {
          setUserData(res);
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

  const editProfile = async (e) => {
    e.preventDefault();
    // Update formData.photo with photoLink if photoLink is available
    const updatedData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      photo: photoLink || userData.photo,
    };
    // console.log(updatedData);

    // Call the updateProfile function with updatedData
    const profile = await updateProfile(updatedData);

    if (profile) {
      navigate("/profile");
    }
  };

  return (
    <div>
      <div className="container mx-auto flex items-center justify-center lg:w-1/2 sm:w-full">
        <div className="bg-white p-8 rounded-lg shadow-md w-1/2">
          <div className="flex relative justify-center">
            <img
              src={photoLink ? photoLink : userData.photo}
              alt="avatar"
              className="rounded-full  w-56 h-56 object-cover mb-4"
            />
            <div className="w-10 h-fit bottom-7 opacity-80 right-8 absolute hover:opacity-100">
              <ImageIcon photoLink={photoLink} setPhotoLink={setPhotoLink} />
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Bikram"
              required=""
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              value={userData.email}
              onChange={handleChange}
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="example@example.com"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
            >
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Phone number"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
            >
              Bio
            </label>
            <input
              type="text"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              id="bio"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Tell something about yourself"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={editProfile}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
