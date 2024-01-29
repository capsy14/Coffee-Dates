// App.js
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Home2 from "./pages/Home/Home-d";
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
axios.defaults.withCredentials = true;
function App() {
  return (
    <>
      <header className="App-head">
        <div className="pt-16">
          <BrowserRouter>
            <ToastContainer />
            <Navbar />
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
                    <WalletConnect />
                  </div>
                }
              />
              <Route path="/product" element={<Product />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/wallet" element={<Home />} />
              <Route path="/chatvideo" element={<Home2 />} />
              <Route path="/chat" element={<Chat />} />
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
