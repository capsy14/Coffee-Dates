// App.js
import React from "react";
import "./App.css";
import WalletConnect from "./components/WalletConnect"; // Update the path accordingly
import Banner from "./components/Banner";
import Button from "./components/Button";
import Feature from "./components/Feature";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <header className="App-head">
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Hero />
                  <Feature />
                  <Banner />
                  <WalletConnect />
                </div>
              }
            />
            <Route path="/product" element={<Product />} />
          </Routes>
        </BrowserRouter>
      </header>
    </>
  );
}

export default App;
