import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import { UserContext } from "./UserProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [userName, setUserName] = useState("");
  const [cadd, setCadd] = useState("");
  const [response, setResponse] = useState(null);
  const [logged, setLogg] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputData = {
      userName: userName,
      cadd: cadd,
    };

    try {
      const res = await axios.post("http://localhost:8000/login", inputData);
      // setResponse(res.data);
      localStorage.setItem("myData", JSON.stringify(res.data.data));
      var x = JSON.parse(localStorage.getItem("myData"));
      console.log(x);
      toast.success("Login Successfull");
      window.alert("Login Successfull");
      setLogg(true);
      // console.log(x);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <div className="login-container">
        <h2>Login Form</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            <label>Username:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-container">
            <label>CADD:</label>
            <input
              type="text"
              value={cadd}
              onChange={(e) => setCadd(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        {response && (
          <div className="response-container">
            <h3>Response from Server:</h3>
            <p>{response.msg}</p>
            <pre>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        )}
      </div>
      {logged && (
        <Link to="/opposite">
          <button className="ml-3 mg-1">Browse</button>
        </Link>
      )}
    </>
  );
};

export default Login;
