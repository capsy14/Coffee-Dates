import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/services";
import { showToast } from "../utils/toastUtils";
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
      return showToast.error("All fields are required");
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

        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE4CF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex justify-center items-center flex-wrap gap-8">
          {/* Illustration */}
          <div className="hidden lg:block lg:w-1/2">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full h-auto max-w-md mx-auto"
              alt="Coffee dating illustration"
            />
          </div>
          
          {/* Login Form */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#DEB887]/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ☕ Welcome Back
                </h2>
                <p className="text-gray-600">Sign in to your coffee dating account</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200 bg-white text-gray-900"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    id="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DEB887] focus:border-[#DEB887] transition-colors duration-200 bg-white text-gray-900"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#DEB887] focus:ring-[#DEB887] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-[#DEB887] hover:text-[#CD853F] font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#DEB887] hover:bg-[#CD853F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DEB887] transition-colors duration-200"
                >
                  Sign In
                </button>

                <div className="text-center">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link
                    to="/register"
                    className="font-medium text-[#DEB887] hover:text-[#CD853F] transition-colors duration-200"
                  >
                    Create one now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
