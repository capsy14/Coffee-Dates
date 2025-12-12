import React, { useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Recording page - Replaced Huddle implementation
 * This is a placeholder that can be integrated with WebRTC recording
 */
const Rec = () => {
  const params = useParams();
  const [roomId] = useState(params.roomId?.toString() || "");

  return (
    <div className="grid grid-cols-2 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Recording Page</h2>
        <p className="text-gray-600 mb-4">Room ID: {roomId}</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            📹 Recording feature is being updated to work with WebRTC.
          </p>
          <p className="text-yellow-600 text-sm mt-2">
            Use the new WebRTC video call component at /video-call
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rec;
