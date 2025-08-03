import React, { useState } from "react";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [addressInput, setAddressInput] = useState(""); // State to hold input address

  const getdata = async () => {
    try {
      const targetAddress = addressInput || account; // Use input address or default to account
      const dataArray = await contract.display(targetAddress);

      if (dataArray.length > 0) {
        const images = dataArray.map((item, i) => ({
          src: item,
          href: `https://gateway.pinata.cloud/ipfs/${item.substring(6)}`,
          id: i
        }));
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
    <div className="w-full space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter wallet address to view photos..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 text-sm md:text-base"
            value={addressInput}
            onChange={handleAddressChange}
          />
          <button
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap"
            style={{background: 'linear-gradient(to right, #DEB887, #CD853F)'}}
            id="get-data"
            onClick={getdata}
          >
            <span>🔍</span>
            <span>View Gallery</span>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Leave blank to view your own photos, or enter someone's address to view their shared gallery
        </p>
      </div>

      {/* Photo Gallery */}
      <div className="min-h-[200px]">
        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((imageData, index) => (
              <a
                key={index}
                href={imageData.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-square bg-gray-100">
                  <img 
                    src={imageData.src} 
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-2xl">🔍</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-500 text-lg">No photos found</p>
            <p className="text-gray-400 text-sm mt-2">Upload some memories or check if the address has shared photos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
