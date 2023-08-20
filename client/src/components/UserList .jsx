import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.BASE_URL}/users`);
        setUsers(response.data.allUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <img src={user.photo} alt={user.userName} />
            <p>Name: {user.userName}</p>
            <p>Age: {user.age}</p>
            <p>Gender: {user.gender}</p>
            <p>Status: {user.status}</p>
            <p>Email: {user.email}</p>
            <p>Address: {user.cadd}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
