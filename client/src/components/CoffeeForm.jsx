import React, { useState } from "react";

const CoffeeForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    age: "",
    gender: "",
    status: "single",
    email: "",
    photo: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here you can add your logic to send the form data to the backend
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
            <option value="other">Other</option>
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
      </div>
    </div>
  );
};

export default CoffeeForm;
