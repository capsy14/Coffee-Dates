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
    <div>
      <div className=" flex justify-center pt-4 bg-gray-800 h-full flex-wrap gap-5">
        <div className="bg-white shadow-md  rounded flex-[1]  max-w-lg p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-12 md:mb-0  lg:max-w-md">
              <img
                src={
                  photoLink
                    ? photoLink
                    : "https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                }
                className="w-full h-full"
                alt="Phone image"
              />
              <ImageIcon photoLink={photoLink} setPhotoLink={setPhotoLink} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Register in to our platform
            </h3>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
              >
                Your Name
              </label>
              <input
                type="name"
                name="name"
                value={name}
                onChange={handleChange}
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Bikram"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
              >
                Gender
              </label>
              <select
                name="gender"
                value={gender}
                onChange={handleChange}
                id="gender"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required=""
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required=""
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5"></div>
              </div>
              <a
                href="#"
                className="text-sm text-blue-700 hover:underline ml-auto dark:text-blue-500"
              >
                Lost Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login to your account
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Already registered?{" "}
              <a
                href="/login"
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
