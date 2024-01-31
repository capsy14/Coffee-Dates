import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME, SET_USER } from "../redux/slice/userSlice";

const initialState = {
  email: "",
  password: "",
};
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required");
    }
    const userData = {
      email,
      password,
    };
    try {
      const response = await loginUser(userData);
      if (response) {
        // console.log(response.user);
        await dispatch(SET_LOGIN(true));
        await dispatch(SET_NAME(response.user.name));
        await dispatch(SET_USER(response.user));

        navigate("/product");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className=" flex justify-center pt-24 bg-[#f0ebdf] h-full flex-wrap p-12 gap-5">
        <div className="mb-12 md:mb-0  lg:max-w-md hidden sm:block">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="w-full h-full"
            alt="Phone image"
          />
        </div>
        <div className="bg-white shadow-md  rounded flex-[1]  max-w-lg p-4 sm:p-6 lg:p-8 bg-[#efe5cb]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-medium text-green-400">
              Sign in to our platform
            </h3>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 block mb-2"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
              className="w-full text-slate-600 bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Login to your account
            </button>
            <div className="text-sm font-medium text-gray-500">
              Not registered?{" "}
              <a
                href="/register"
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                Create account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
