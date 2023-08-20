import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CoffeeForm = ({
  sex,
  setSex,
  seName,
  setSeName,
  seEmail,
  setSeEmail,
}) => {
  const [formData, setFormData] = useState({
    userName: "",
    age: "",
    gender: "",
    status: "single",
    email: "",
    cadd: "",
    photo: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSex(e.target[2].value);
    setSeName(e.target[0].value);
    setSeEmail(e.target[4].value);
    // console.log(e.target[2].value);
    // console.log(e.target[2].value, e.target[0].value, e.target[4].value);
    // toast.warning(sex);
    // // console.log(formData);
    // // Here you can add your logic to send the form data to the backend
    try {
      let imgHash;

      //formdata for image upload to pinata
      try {
        const formImg = new FormData();
        formImg.append("file", formData.photo);

        //sending img to ipfs and getting imgHash
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formImg,
          headers: {
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY_COFFEEFORM,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY_COFFEEFORM,
            "Content-Type": "multipart/form-data",
          },
        });

        imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        //console.log(imgHash);
      } catch (error) {
        console.log("Error in ipfs");
      }
      console.log(imgHash);

      const formDataToSend = {
        userName: formData.userName,
        age: formData.age,
        gender: formData.gender,
        status: formData.status,
        email: formData.email,
        cadd: formData.cadd,
        photo: imgHash,
      };
      //console.log(formDataToSend);

      const response = await axios.post(
        `${import.meta.env.BASE_URL}/form`,
        formDataToSend
      );

      if(response.error){
        console.log(response.error);
      }
      //console.log(response);
      // alert("Data sent successfully...");
      toast.success("Registered Successfully");
      setIsSubmitted(true);
    } catch (error) {
      console.log("error in sending data to backend");
      //console.log(error);
    }
  };

  return (
    <div className="form-form-container">
      <div className="form-container">
        <h2>Complete Your Coffee Mate Profile</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="single">Single</option>
            <option value="couple">Couple</option>
          </select>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="cadd">Contract Address</label>
          <input
            type="text"
            id="cadd"
            name="cadd"
            value={formData.cadd}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="photo">Upload Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept=".jpg, .jpeg, .png"
            onChange={handlePhotoChange}
          />
          <br />
          <button type="submit" className="ml-3">
            Submit
          </button>
        </form>

        {/* <div className="form-container2"></div> */}

        {isSubmitted && (
          <Link to="/opposite">
            <button className="ml-3 mg-1">Browse</button>
          </Link>
        )}

        <Link to="/opposite">View</Link>
      </div>
    </div>
  );
};

export default CoffeeForm;
