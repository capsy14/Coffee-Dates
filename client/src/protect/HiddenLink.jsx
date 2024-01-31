import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const isLoggedIn = localStorage.getItem("isLoggedIn");

export const ShowOnLogin = ({ children }) => {
  if (isLoggedIn == "true") {
    return <>{children}</>;
  }

  return null;
};

export const ShowOnLogout = ({ children }) => {
  if (isLoggedIn != "true") {
    // navigate("/");
    return <>{children}</>;
  }
  return <></>;
};
