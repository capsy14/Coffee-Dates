import { toast } from "react-toastify";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND;
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/register`, userData, {
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      toast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
export const loginUser = async (userData) => {
  // console.log(BACKEND_URL);
  try {
    const response = await axios.post(`${BACKEND_URL}/login`, userData);
    if (response.statusText === "OK") {
      toast.success("Login Successful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const logOut = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logout`);
    if (response.statusText === "OK") {
      toast.success("Log Out Successful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
export const updateProfile = async (data) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/updateuser`, data);
    if (response.statusText === "OK") {
      toast.success("Profile Updated Successfully...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
export const getUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/getuser`);
    if (response.statusText === "OK") {
      // toast.success("Profile Updated Successfully...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
export const passwordChange = async (data) => {
  try {
    // console.log(data + " hello ");
    const response = await axios.patch(`${BACKEND_URL}/changepass`, data);
    if (response.statusText === "OK") {
      toast.success("Password Changed Successfully...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
export const oppositeGenderProfile = async () => {
  try {
    // console.log(data + " hello ");
    const response = await axios.get(`${BACKEND_URL}/opposite`);
    if (response.statusText === "OK") {
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const oppositeGenderEmail = async (data) => {
  try {
    // console.log(data);
    // console.log(data + " hello ");
    const response = await axios.post(`${BACKEND_URL}/opposite/profile`, data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
