// App.js
import React, { useState } from "react";
import "./App.css";
import WalletConnect from "./components/WalletConnect";
import Banner from "./components/Banner";
import Button from "./components/Button";
import Feature from "./components/Feature";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import Home from "./components/Home";
import CoffeeForm from "./components/CoffeeForm";
import Footer from "./components/Footer";
import Chat from "./components/Chat";
import Home2 from "./pages/Home/Home-d";
import Rec from "./pages/Rec/Rec";
import OurTeam from "./components/OurTeam";
import UserList from "./components/UserList ";
import Email from "./components/Email";
import Buy from "./components/Buy";
import OppositeGenderProfiles from "./components/OppositeGender";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Ipfssave from "./IPFSsave";
import Login from "./components/Login";
function App() {
  const [account, setAccount] = useState("Account not connected");
  const [sex, setSex] = useState("");
  const [seName, setSeName] = useState("");
  const [seEmail, setSeEmail] = useState("");
  const [reName, setReName] = useState("");
  const [reEmail, setReEmail] = useState("");
  const [paid, setPaid] = useState(false);
  return (
    <>
      <header className="App-head">
        <div className="pt-16">
          <BrowserRouter>
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
                    <WalletConnect account={account} setAccount={setAccount} />
                  </div>
                }
              />
              <Route path="/product" element={<Product />} />
              <Route path="/chatvideo" element={<Home2 paid={paid} />} />
              <Route
                path="/opposite"
                element={
                  <OppositeGenderProfiles
                    sex={sex}
                    setSex={setSex}
                    reName={reName}
                    setReName={setReName}
                    reEmail={reEmail}
                    setReEmail={setReEmail}
                  />
                }
              />
              <Route
                path="/opposite/email"
                element={
                  <Email
                    seName={seName}
                    seEmail={seEmail}
                    reName={reName}
                    reEmail={reEmail}
                    setReEmail={setReEmail}
                    setReName={setReName}
                    setSeEmail={setSeEmail}
                    setSeName={setSeName}
                  />
                }
              />
              <Route path="/rec/:roomId" element={<Rec />} />
              <Route
                path="/ipfsphotoshare"
                element={<Ipfssave paid={paid} />}
              />
              <Route
                path="/wallet"
                element={
                  <Home
                    account={account}
                    setAccount={setAccount}
                    setPaid={setPaid}
                    paid={paid}
                  />
                }
              />
              <Route
                path="/buy"
                element={<Buy setPaid={setPaid} paid={paid} />}
              />
              <Route
                path="/form"
                element={
                  <CoffeeForm
                    sex={sex}
                    setSex={setSex}
                    seName={seName}
                    setSeName={setSeName}
                    seEmail={seEmail}
                    setSeEmail={setSeEmail}
                  />
                }
              />
              <Route
                path="/chat"
                element={<Chat account={account} setAccount={setAccount} />}
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      </header>
      <Footer />
    </>
  );
}

export default App;
