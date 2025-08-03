// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Feature from "./components/Feature";
import Banner from "./components/Banner";
import OurTeam from "./components/OurTeam";
import WalletConnect from "./components/WalletConnect";
import Product from "./components/Product";
import Register from "./components/Register";
import Home from "./components/Home";
import Home2 from "./pages/Home/Home-d-safe";
import Chat from "./components/Chat";
import Ipfssave from "./components/Ipfssave";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import EditProfile from "./components/EditProfile";
import UserProfile from "./components/UserProfile";
import axios from "axios";
import Opposite from "./components/Opposite";
import Email from "./components/Email";
import BuyCoffee from "./components/BuyCoffee";
import { getLoginStatus } from "./services/services";
import Loader from "./components/Loader";
import MLMatchmaker from "./components/ml/MLMatchmaker";
import SocketIO from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND.replace("/api/users/", "");
axios.defaults.withCredentials = true;
export const socket = SocketIO.connect(BACKEND_URL);
function App() {
  // const initializeSocket = () => {
  //   socket = SocketIO.connect(BACKEND_URL);

  //   socket.on("connect", () => {
  //     console.log("Socket connected:", socket.id);
  //   });

  //   socket.on("connect_error", (error) => {
  //     console.error("Socket connection error:", error);
  //   });
  // };

  const funccc = async (navigate) => {
    const res = await getLoginStatus();
    console.log("here is the res in app.js " + JSON.stringify(res));
    localStorage.setItem("isLoggedIn", res.data);

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      // socket.emit("userConnected", res._id);
      // initializeSocket();
    } else {
      navigate("/login");
    }
  };

  // Component to handle authentication inside Router context
  function AuthHandler() {
    const navigate = useNavigate();
    
    useEffect(() => {
      funccc(navigate);
    }, [navigate]);
    
    return null; // This component doesn't render anything
  }
  return (
    <>
      <header className="App-head">
        <div className="pt-16">
          <BrowserRouter>
            <AuthHandler />
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              limit={3}
              enableMultiContainer={false}
              containerId="global-toast-container"
              toastClassName="custom-toast"
              bodyClassName="custom-toast-body"
              progressClassName="custom-toast-progress"
              style={{ zIndex: 9999 }}
            />
            <Navbar />
            <WalletConnect />
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Hero />
                    <Feature />
                    <Banner />
                    {/* <Login /> */}
                    {/* <OppositeGenderProfiles sex={sex} setSex={setSex} /> */}
                    {/* <UserList /> */}
                    <OurTeam />
                  </div>
                }
              />
              <Route path="/product" element={<Product />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:id" element={<BuyCoffee />} />
              <Route path="/wallet/:id" element={<Home />} />

              <Route path="/chatvideo" element={<Home2 />} />
              <Route path="/ml-matches" element={<MLMatchmaker />} />

              <Route path="/chat" element={<Chat />} />
              <Route path="/loader" element={<Loader />} />
              <Route path="/ipfsphotoshare" element={<Ipfssave />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/opposite" element={<Opposite />} />
              <Route path="/opposite/:id" element={<Email />} />
            </Routes>
          </BrowserRouter>
        </div>
      </header>
      <Footer />
    </>
  );
}

export default App;
