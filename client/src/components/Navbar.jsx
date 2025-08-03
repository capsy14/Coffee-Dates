import React, { useState, useEffect } from "react";
// import Button from "./Button";
import { Link } from "react-router-dom";
import { ShowOnLogin, ShowOnLogout } from "../protect/HiddenLink";
const Nav = () => {
  let [open, setOpen] = useState(false);
  let [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`w-full fixed top-0 left-0 transition-all duration-300 border-b-2 border-[#8B4513] border-opacity-20 ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
      style={{ zIndex: 1000, background: '#ECE4CF' }}
      id="nav1"
    >
      <div className="md:flex items-center justify-between py-4 md:px-10 px-7 ">
        <div className="font-bold text-3xl cursor-pointer flex items-center font-Poppins">
          <span className="mr-2 text-4xl" style={{ color: '#8B4513' }}>
          </span>
          <Link 
            to="/" 
            style={{ color: '#8B4513' }}
            className="hover:opacity-80 transition-opacity duration-300"
          >
            Coffee Dates
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <div
          onClick={() => setOpen(!open)}
          className="block md:hidden absolute right-8 top-6 cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-[#8B4513] hover:bg-opacity-20"
        >
          <div className="relative w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`block h-0.5 w-6 bg-[#8B4513] transition-all duration-300 ${
                open ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-[#8B4513] transition-all duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-[#8B4513] transition-all duration-300 ${
                open ? '-rotate-45 -translate-y-0' : 'translate-y-1.5'
              }`}
            ></span>
          </div>
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-20 left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in md:bg-transparent bg-[#ECE4CF] md:shadow-none shadow-lg ${
            open ? "top-20 opacity-100 visible" : "top-[-490px] opacity-0 invisible md:opacity-100 md:visible"
          }`}
        >
          {/* starting here */}
          <li
            className="md:ml-8 text-[#8B4513] md:my-0 my-7"
            onClick={() => setOpen(false)}
            id="nav"
          >
            <Link to="/" className="block w-full">HOME</Link>
          </li>
          <ShowOnLogin>
            <li className="md:ml-8 text-[#8B4513] md:my-0 my-7" onClick={() => setOpen(false)} id="nav">
              <Link to="/product" className="block w-full">COFFEE</Link>
            </li>
          </ShowOnLogin>
           <ShowOnLogin>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/ml-matches" className="block w-full">AI MATCHES</Link>
            </li>
          </ShowOnLogin>
          <ShowOnLogout>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/register" className="block w-full">REGISTER</Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogout>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/login" className="block w-full">LOGIN</Link>
            </li>
          </ShowOnLogout>
          {/* <ShowOnLogin>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/wallet/1">WALLET</Link>
            </li>
          </ShowOnLogin> */}
          <ShowOnLogin>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/chat" className="block w-full">CHAT</Link>
            </li>
          </ShowOnLogin>
          <ShowOnLogin>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/chatvideo" className="block w-full">VIDEOCHAT</Link>
            </li>
          </ShowOnLogin>
          <ShowOnLogin>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/ipfsphotoshare" className="block w-full">MEMORIES</Link>
            </li>
          </ShowOnLogin>
         
          <ShowOnLogin>
            <li
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              onClick={() => setOpen(false)}
              id="nav"
            >
              <Link to="/profile" className="block w-full">PROFILE</Link>
            </li>
          </ShowOnLogin>

          {/* {Links.map((link) => (
            <li
              key={link.name}
              className="md:ml-8 text-[#8B4513] md:my-0 my-7"
              id="nav"
            >
              <a
                href={link.link}
                className="text-green-800 hover:text-gray-400 hover:bg-burlywood-600 text-white duration-500 text-lg" // Add the text size class
                id="nav"
              >
                {link.name}
              </a>
            </li>
          ))} */}
          {/* <Link to=""></Link> */}
          {/* <Button>Register</Button> */}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
