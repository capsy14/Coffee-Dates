import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import { useSelector, useDispatch } from "react-redux";
import ChatItems from "./ChatItems";
import { ArrowLeft } from "lucide-react";
import { getUser } from "../services/services";
import { setReceiver, setReceiverName, setReceiverEmail, setReceiverPhoto } from "../redux/slice/receiverSlice";
import { socket } from "../App";
import "./Chat.css";

function Chat() {
  const { receiver, receiverName, receiverPhoto, receiverEmail } = useSelector(
    (state) => state.receiver
  );
  const dispatch = useDispatch();
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Listen for online users updates
  useEffect(() => {
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users || []);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, []);

  // Update mobile view when receiver changes
  useEffect(() => {
    if (receiver && isMobile) {
      setShowMobileChat(true);
    }
  }, [receiver, isMobile]);

  const handleBackClick = () => {
    setShowMobileChat(false);
    // Clear receiver on mobile to go back to chat list
    if (isMobile) {
      dispatch(setReceiver(""));
      dispatch(setReceiverName(""));
      dispatch(setReceiverEmail(""));
      dispatch(setReceiverPhoto(""));
    }
  };

  // Check if current receiver is online
  const isReceiverOnline = () => {
    return Array.isArray(onlineUsers) && onlineUsers.includes(receiver);
  };

  // Get status display text
  const getStatusDisplay = () => {
    if (isReceiverOnline()) {
      return "Online";
    }
    return receiverEmail || "Offline";
  };

  return (
    <div className="chat-container">
      <div className="chat-layout">
        {/* Chat List Sidebar - Show on desktop always, on mobile only when no chat is selected */}
        <div
          className={`chat-list-container ${
            isMobile && showMobileChat ? "hidden" : "flex"
          }`}
        >
          <div className="chat-list-header">
            <h2 className="chat-list-title">
              <span>💬</span>
              Coffee Chats
            </h2>
            <p className="chat-list-subtitle">Connect with your coffee companions</p>
          </div>
          <div className="chat-list-content">
            <ChatList />
          </div>
        </div>

        {/* Chat Area - Show when receiver is selected */}
        {receiver ? (
          <div
            className={`chat-area ${
              isMobile && !showMobileChat ? "hidden" : "flex"
            }`}
          >
            <div className="chat-header">
              {isMobile && (
                <button
                  onClick={handleBackClick}
                  className="chat-back-btn"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <img
                src={receiverPhoto}
                alt={receiverName}
                className="chat-user-avatar"
              />
              <div className="chat-user-info">
                <h2>{receiverName}</h2>
                <div className={`chat-user-status ${isReceiverOnline() ? 'online' : 'offline'}`}>
                  {getStatusDisplay()}
                </div>
              </div>
            </div>
            <ChatItems />
          </div>
        ) : (
          // Empty state - only show on desktop when no chat is selected
          !isMobile && (
            <div className="chat-empty">
              <div className="chat-empty-icon">☕💬</div>
              <h3>Welcome to Coffee Chats!</h3>
              <p>Select a conversation to start brewing connections</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Chat;
