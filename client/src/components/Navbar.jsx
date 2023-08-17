import React, { useState, useEffect } from "react";
// import Button from "./Button";
import { Link } from "react-router-dom";
const Nav = () => {
  let Links = [
    { name: "HOME", link: "/" },
    { name: "CHAT", link: "/chat" },
    { name: "BUY COFFEE", link: "/product" },
    { name: "WALLET", link: "/wallet" },
    { name: "REGISTER", link: "/form" },
    { name: "VIDEOCHAT", link: "/chatvideo" },
    { name: "IPFSSAVE", link: "/ipfsphotoshare" },
  ];
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
      className={`w-full fixed top-0 left-0 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ zIndex: 1000 }} // Increase the z-index value
      id="nav1"
    >
      <div className="md:flex items-center justify-between py-4 md:px-10 px-7">
        <div
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
          text-green-600" // Change the text color to green
        >
          <span className="text-white-3xl text-indigo-600 mr-1 pt-2 ">
            {/* <ion-icon name="cafe-outline"></ion-icon> */}
          </span>
          Koffee Ka Chakkar
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl block absolute right-8 top-6 cursor-pointer md:hidden bg-#ECE4CF"
        >
          {/* <div name={open ? "close" : "menu"}>hi</div> */}
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static text-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {/* starting here */}
          <li className="md:ml-8 text-green md:my-0 my-7" id="nav">
            <Link to="/">HOME</Link>
          </li>
          <li className="md:ml-8 text-green md:my-0 my-7" id="nav">
            <Link to="/chat">CHAT</Link>
          </li>
          <li className="md:ml-8 text-green md:my-0 my-7" id="nav">
            <Link to="/wallet">WALLET</Link>
          </li>
          <li className="md:ml-8 text-green md:my-0 my-7" id="nav">
            <Link to="/product">PRODUCT</Link>
          </li>
          <li className="md:ml-8 text-green md:my-0 my-7" id="nav">
            <Link to="/form">REGISTER</Link>
          </li>
          <li className="md:ml-8 text-green md:my-0 my-7" id="nav">
            <Link to="/chatvideo">VIDEOCHAT</Link>
          </li>
          <li className="md:ml-8 text-green md:my-0 my-7" id="nav">
            <Link to="/ipfsphotoshare">MEMORIES</Link>
          </li>

          {/* {Links.map((link) => (
            <li
              key={link.name}
              className="md:ml-8 text-green md:my-0 my-7"
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
