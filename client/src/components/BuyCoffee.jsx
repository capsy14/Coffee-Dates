import React from "react";
import { useParams } from "react-router-dom";
import Product from "./data.json";
const BuyCoffee = () => {
  const param = useParams();
  const idd = param.id;
  return (
    <div className="text-black">
      <div className="text-black">{idd}</div>
      {Product[idd].name}
    </div>
  );
};

export default BuyCoffee;
