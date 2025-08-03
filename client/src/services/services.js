import { showToast } from "../utils/toastUtils";
import axios from "axios";
import { socket } from "../App";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/register`, userData, {
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      showToast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};
export const loginUser = async (userData) => {
  // console.log(BACKEND_URL);
  try {
    console.log("cururl=", `${BACKEND_URL}/login`);
    const response = await axios.post(`${BACKEND_URL}/login`, userData);
    if (response.statusText === "OK") {
      showToast.success("Login Successful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};

export const logOut = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logout`);
    if (response.statusText === "OK") {
      showToast.success("Log Out Successful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};
export const updateProfile = async (data) => {
  try {
    const response = await axios.patch(`${BACKEND_URL}/updateuser`, data);
    if (response.statusText === "OK") {
      showToast.success("Profile Updated Successfully...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};
export const getUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/getuser`);
    if (response.statusText === "OK") {
      // toast.success("Profile Updated Successfully...");
      // console.log("getuser " + JSON.stringify(response.data._id));
      socket.emit("userConnected", response.data._id);
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};
export const passwordChange = async (data) => {
  try {
    // console.log(data + " hello ");
    const response = await axios.patch(`${BACKEND_URL}/changepass`, data);
    if (response.statusText === "OK") {
      showToast.success("Password Changed Successfully...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};
export const oppositeGenderProfile = async () => {
  try {
    // console.log(data + " hello ");
    const response = await axios.get(`${BACKEND_URL}/opposite`);
    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};

export const oppositeGenderEmail = async (data) => {
  try {
    // console.log(data);
    // console.log(data + " hello ");
    const response = await axios.post(`${BACKEND_URL}/opposite/profile`, data);

    console.log("services " + response);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};

export const getLoginStatus = async () => {
  const res = await axios.get(`${BACKEND_URL}/loggedin`);
  return res;
};

// Match management functions
export const addMatch = async (matchedUserId) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/addmatch`, { matchedUserId }, {
      withCredentials: true,
    });
    if (response.status === 200) {
      showToast.success("Coffee match added! ☕💕");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};

export const removeMatch = async (matchedUserId) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/removematch`, { matchedUserId }, {
      withCredentials: true,
    });
    if (response.status === 200) {
      showToast.success("Match removed");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    showToast.error(message);
  }
};

// export const
