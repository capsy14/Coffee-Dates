import React, { useState, useEffect } from "react";

const Email = ({ seName, seEmail, reName, reEmail }) => {
  // State to store selected date and time
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [senderExists, setSenderExists] = useState(!!seEmail);
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
        console.log("Your data has been sent successfully...");
      } else {
        console.log("Some error occurred");
        const errorData = await response.json();
        console.log(errorData);
      }
    } catch (error) {
      console.log("An error occurred while sending the request:", error);
    }
  };

  return (
    <div className="email-container">
      {!senderExists && (
        <h1 className="text-red-500">Please Register Yourself to Send Email</h1>
      )}

      <h2>Select Date and Time for Coffee</h2>
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
