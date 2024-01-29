import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, oppositeGenderEmail } from "../services/services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const seInitailState = {
  seName: "",
  seEmail: "",
};
const reInitialState = {
  reName: "",
  reEmail: "",
};
const Email = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [seData, setSeData] = useState(seInitailState);
  const [reData, setReData] = useState(reInitialState);
  const { seName, seEmail } = seData;
  const { reName, reEmail } = reData;
  const id = useParams();
  useEffect(() => {
    const fetchSender = async () => {
      const data = await getUser();
      const res = { seName: data.name, seEmail: data.email };
      setSeData(res);
    };
    fetchSender();
  }, []);
  useEffect(() => {
    const fetchReciever = async () => {
      const data = await oppositeGenderEmail(id);
      const res = { reName: data.name, reEmail: data.email };
      setReData(res);
    };
    fetchReciever();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      service_id: import.meta.env.VITE_EMAIL_SERVICE_ID,
      template_id: import.meta.env.VITE_EMAIL_TEMPLATE_ID,
      user_id: import.meta.env.VITE_EMAIL_USER_ID,
      template_params: {
        from_name: seName,
        to_name: reName,
        date: selectedDate,
        time: selectedTime,
        from_email: seEmail,
        to_email: reEmail,
      },
    };

    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success("Email Sent Successfully");
        navigate("/opposite");
      } else {
        console.log("Some error occurred");
        const errorData = await response.json();
        console.log(errorData);
        toast.error(errorData);
      }
    } catch (error) {
      console.log("An error occurred while sending the request:", error);
    }
  };

  return (
    <div className="email-container">
      <h2>Select Date and Time for Coffee</h2>
      <h1 className="text-red-500"></h1>
      <table className="email-table">
        <tbody>
          <tr>
            <th>From:</th>
            <td>{seName}</td>
          </tr>
          <tr>
            <th>Sender Email:</th>
            <td>{seEmail}</td>
          </tr>
          <tr>
            <th>Receiver Name:</th>
            <td>{reName}</td>
          </tr>
          <tr>
            <th>Receiver Email:</th>
            <td>{reEmail}</td>
          </tr>
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input
          type="date"
          className="email-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
        <br />
        <label>Time:</label>
        <input
          type="time"
          className="email-input"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="send-button">
          Send Coffee Invitation
        </button>
      </form>
    </div>
  );
};

export default Email;
