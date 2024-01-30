import React, { useState } from "react";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [addressInput, setAddressInput] = useState(""); // State to hold input address

  const getdata = async () => {
    try {
      const targetAddress = addressInput || account; // Use input address or default to account
      const dataArray = await contract.display(targetAddress);

      if (dataArray.length > 0) {
        const images = dataArray.map((item, i) => (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
            key={i}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={`${item}`} alt="new" className="image-list" />
          </a>
        ));
        setData(images);
      } else {
        alert("No images to display");
      }
    } catch (e) {
      console.error("Error:", e);
      alert("An error occurred");
    }
  };

  const handleAddressChange = (event) => {
    setAddressInput(event.target.value);
  };

  return (
    <>
      <div className=" w-1/2 mx-auto h-1/2 mt-6 ">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className=" w-1/3 border-2 block mx-auto h-12 rounded-md sm:p-5 p-2 drop-shadow-lg text-xs sm:text-xl"
        value={addressInput}
        onChange={handleAddressChange}
      ></input>
      <button
        className=" w-1/5 mx-auto block mt-5 drop-shadow-lg text-xs sm:text-xl"
        id="get-data"
        onClick={getdata}
      >
        Get Data
      </button>
    </>
  );
};

export default Display;
