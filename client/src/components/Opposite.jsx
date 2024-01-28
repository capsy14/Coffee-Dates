import React, { useEffect } from "react";
import { oppositeGenderProfile } from "../services/services";

export default function Opposite() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await oppositeGenderProfile();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1 className=" text-black">Hello</h1>
    </div>
  );
}
