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
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
        value={addressInput}
        onChange={handleAddressChange}
      ></input>
      <button className="center button" id="get-data" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};

export default Display;
