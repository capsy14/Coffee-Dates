import React from "react";
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <div>
      <section id="banner">
        <h4>Ab Apna Chakker Chalau</h4>
        <h3 className=" text-xl ml-4 sm:text-4xl">
          Seek a coffee mate, spark delightful conversations
        </h3>
        <Link to="/product">
          <button>Explore More</button>
        </Link>{" "}
      </section>
    </div>
  );
}
