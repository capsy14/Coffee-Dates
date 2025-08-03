import React, { useState } from "react";
import "./fileUpload.css";
import axios from "axios";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      contract.add(account, imgHash);
      console.log(imgHash);

      alert("Image uploaded successfully.");
      setFileName("No image selected");
      setFile(null);
    } catch (error) {
      if (error.response) {
        console.log("Server responded with:", error.response.data);
        console.log("Status code:", error.response.status);
      }
      alert("Unable to upload image to Pinata. Please try again later.");
    }
  };

  const retrieveFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="w-full">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* File Selection */}
        <div className="space-y-4">
          <label 
            htmlFor="file-upload" 
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                📷
              </div>
              <p className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">
                Choose Your Memory
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </label>
          
          <input
            className="hidden"
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            accept="image/*"
            onChange={retrieveFile}
          />
        </div>

        {/* Selected File Display */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-700 text-sm">📁</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Selected File:</p>
              <p className="text-xs text-gray-500 truncate">{fileName}</p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button 
          type="submit" 
          disabled={!file || !account}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-[1.02] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
          style={{background: !file || !account ? undefined : 'linear-gradient(to right, #DEB887, #CD853F)'}}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>📤</span>
            <span>{!account ? "Connect Wallet First" : "Upload to IPFS"}</span>
          </span>
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
