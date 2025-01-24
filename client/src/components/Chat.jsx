import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import { useSelector } from "react-redux";
import ChatItems from "./ChatItems";
import { ArrowLeft } from "lucide-react";
import { getUser } from "../services/services";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND;

function Chat() {
  const { receiver, receiverName, receiverPhoto, receiverEmail } = useSelector(
    (state) => state.receiver
  );
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Update mobile view when receiver changes
  useEffect(() => {
    if (receiver) {
      setShowMobileChat(true);
    }
  }, [receiver]);

  const handleBackClick = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="flex overflow-hidden w-full mt-1 md:mt-6 lg:mt-0 ">
      {/* ChatList - hidden on mobile when showing chat */}
      <div
        className={`${
          showMobileChat ? "hidden md:block" : "w-full md:w-auto"
        } md:flex-shrink-0`}
      >
        <ChatList />
      </div>

      {/* ChatItems - shown on mobile only when receiver exists and showMobileChat is true */}
      {receiver && (
        <div
          className={`${
            !showMobileChat ? "hidden md:block" : "w-full"
          } relative`}
        >
          {/* Back button - only visible on mobile */}
          <button
            onClick={handleBackClick}
            className="md:hidden absolute top-5 left-2 z-10 p-2 rounded-full bg-[#ECE4CF] hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <ChatItems />
        </div>
      )}
    </div>
  );
}

export default Chat;
