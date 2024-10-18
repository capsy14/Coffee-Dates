import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/services";
import { toast } from "react-toastify";
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
};
export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [image, setImage] = useState();
  const [photoLink, setPhotoLink] = useState();
  const [formData, setFormData] = useState(initialState);
  const { email, password, name, gender, confirm_password, photo } = formData;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }

    if (password !== confirm_password) {
      return toast.error("Passwords do not match");
    }
    try {
      setFormData((prevFormData) => ({ ...prevFormData, photo: photoLink }));
      console.log(formData); // This might still log the previous state
      console.log(photoLink); // This should log the correct photoLink
      const data = { name, email, password, gender, photo: photoLink };
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
    <div className="bg-[#ECE4CF] min-h-screen">
      <div className=" flex justify-center pt-4  flex-wrap gap-5 ">
        <div className="bg-[#f5e8c8] shadow-md  rounded flex-[1]  max-w-2xl p-4 sm:p-6 lg:p-8">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="mb-12 md:mb-0  lg:max-w-md  rounded-xl border-4 overflow-hidden  h-1/2 w-1/2 min-w-[200px] sm:h-1/3 sm:w-1/3 mx-auto">
              <img
                src={
                  photoLink
                    ? photoLink
                    : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                }
                className="w-full h-[200px] object-fill"
                alt="Phone image"
              />
              <div className=" absolute  top-[210px] sm:top-[280px]">
                <ImageIcon photoLink={photoLink} setPhotoLink={setPhotoLink} />
              </div>
            </div>
            <h3 className="text-xl font-medium mt-6 text-gray-900">
              Register in to our platform
            </h3>
            <div className="sm:flex w-full sm:gap-3">
              <div className=" sm:w-1/2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 block mb-2 "
                >
                  Your Name
                </label>
                <input
                  type="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  id="name"
                  className="bg-gray-50 drop-shadow-xl border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Bikram"
                  required=""
                />
              </div>
              <div className=" sm:w-1/2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 block mb-2 "
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  id="email"
                  className="bg-gray-50 border drop-shadow-xl border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@company.com"
                  required=""
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="gender"
                className="text-sm font-medium text-gray-900 block mb-2 "
              >
                Gender
              </label>
              <select
                name="gender"
                value={gender}
                onChange={handleChange}
                id="gender"
                className="bg-gray-50 border drop-shadow-xl border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                required=""
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="sm:flex w-full sm:gap-3">
              <div className=" sm:w-1/2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 block mb-2 "
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border drop-shadow-xl border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  required=""
                />
              </div>
              <div className=" sm:w-1/2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 block mb-2 "
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={confirm_password}
                  onChange={handleChange}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border drop-shadow-xl border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required=""
                />
              </div>
            </div>
            <div className="flex items-start">
              <a
                href="#"
                className="text-sm text-blue-700 hover:underline ml-auto "
              >
                Lost Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login to your account
            </button>
            <div className="text-sm font-medium text-gray-500 ">
              Already registered?{" "}
              <a href="/login" className="text-blue-700 hover:underline ">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
