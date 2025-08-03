import React, { useEffect, useState } from "react";
import { oppositeGenderProfile, getUser } from "../services/services";
import { useSelector, useDispatch } from "react-redux";
import {
  setReceiver,
  setReceiverEmail,
  setReceiverPhoto,
  setReceiverName,
} from "../redux/slice/receiverSlice";
import { socket } from "../App";
import "./ChatList.css";
function ChatLisst() {
  const [oppositeGender, setOppositeGender] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUser, setOnlineUser] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const dispatch = useDispatch();
  const defaultMaleImage =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
  const defaultFemaleImage =
    "https://icon2.cleanpng.com/lnd/20240714/aft/a81tg9lau.webp";

  useEffect(() => {
    socket.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current user data for match checking
        const currentUser = await getUser();
        setCurrentUserData(currentUser);
        
        const res = await oppositeGenderProfile();
        setOppositeGender(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Listen for new messages to update last message display
  useEffect(() => {
    // Listen for incoming messages - using the correct socket event
    socket.on("receiveMessage", (data) => {
      const messageText = data.message?.text || data.message?.message || data.text || data.messageContent;
      const senderId = data.message?.senderId || data.senderId;
      
      if (messageText && senderId) {
        setLastMessages(prev => ({
          ...prev,
          [senderId]: {
            text: messageText,
            timestamp: new Date().getTime()
          }
        }));
      }
    });

    // Listen for sent messages (when current user sends a message)
    socket.on("sendMessage", (data) => {
      const messageText = data.message?.text || data.message?.message || data.text || data.messageContent;
      const receiverId = data.receiverId;
      
      if (messageText && receiverId) {
        setLastMessages(prev => ({
          ...prev,
          [receiverId]: {
            text: messageText,
            timestamp: new Date().getTime()
          }
        }));
      }
    });
    
    return () => {
      socket.off("receiveMessage");
      socket.off("sendMessage");
    };
  }, []);
  
  // Fetch last messages for each user when component loads
  useEffect(() => {
    const fetchLastMessages = async () => {
      if (!oppositeGender.length || !currentUserData) return;
      
      try {
        const messagePromises = oppositeGender.map(async (user) => {
          try {
            const response = await fetch(`${import.meta.env.VITE_APP_BACKEND}message/get/${user._id}`, {
              credentials: 'include'
            });
            const messages = await response.json();
            
            if (Array.isArray(messages) && messages.length > 0) {
              const lastMessage = messages[messages.length - 1];
              return {
                userId: user._id,
                text: lastMessage.text || lastMessage.message || "",
                timestamp: new Date(lastMessage.createdAt || lastMessage.timestamp).getTime()
              };
            }
          } catch (error) {
            return null;
          }
          return null;
        });
        
        const results = await Promise.all(messagePromises);
        const validMessages = results.filter(Boolean);
        
        if (validMessages.length > 0) {
          const messagesObj = {};
          validMessages.forEach(msg => {
            messagesObj[msg.userId] = {
              text: msg.text,
              timestamp: msg.timestamp
            };
          });
          setLastMessages(messagesObj);
        }
      } catch (error) {
        // Handle error silently
      }
    };
    
    fetchLastMessages();
  }, [oppositeGender, currentUserData]);
  const getProfileImage = (p) => {
    // Check if p.photo exists and isn't the default male image
    if (p.photo && p.photo !== defaultMaleImage) {
      return p.photo;
    }

    // Return default image based on gender
    return p.gender.toLowerCase() === "male"
      ? defaultMaleImage
      : defaultFemaleImage;
  };
  
  // Check if user is matched
  const isMatched = (userId) => {
    if (!currentUserData || !currentUserData.matches) {
      return false;
    }
    return currentUserData.matches.includes(userId);
  };


  
  // Get last message for a user
  const getLastMessage = (userId) => {
    const lastMsg = lastMessages[userId];
    if (lastMsg) {
      return lastMsg.text.length > 25 ? lastMsg.text.substring(0, 25) + '...' : lastMsg.text;
    }
    return "Say hello! ☕";
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date().getTime();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };
  const handleSetReceiver = (p, event) => {
    if (!p) {
      console.warn("setReceiver was called with an undefined or null object");
      return;
    }

    dispatch(setReceiver(p._id));
    dispatch(setReceiverName(p.name));
    dispatch(setReceiverEmail(p.email));
    const imgdata = getProfileImage(p);
    dispatch(setReceiverPhoto(imgdata));
    
    // Add active state to clicked item
    document.querySelectorAll('.chat-list-item').forEach(item => {
      item.classList.remove('active');
    });
    if (event?.currentTarget) {
      event.currentTarget.classList.add('active');
    }
  };

  // Sort users: matched users first, then online users, then others
  const sortedUsers = React.useMemo(() => {
    if (!oppositeGender || !Array.isArray(oppositeGender)) return [];
    
    return [...oppositeGender].sort((a, b) => {
      const aMatched = isMatched(a._id);
      const bMatched = isMatched(b._id);
      const aOnline = Array.isArray(onlineUser) && onlineUser.includes(a._id);
      const bOnline = Array.isArray(onlineUser) && onlineUser.includes(b._id);
      const aHasMessages = lastMessages[a._id];
      const bHasMessages = lastMessages[b._id];
      
      // Priority: 1. Matched users, 2. Users with recent messages, 3. Online users, 4. Others
      if (aMatched && !bMatched) return -1;
      if (!aMatched && bMatched) return 1;
      
      if (aHasMessages && !bHasMessages) return -1;
      if (!aHasMessages && bHasMessages) return 1;
      
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      
      // Sort by last message timestamp for matched users or users with messages
      if ((aMatched || aHasMessages) && (bMatched || bHasMessages)) {
        const aTime = lastMessages[a._id]?.timestamp || 0;
        const bTime = lastMessages[b._id]?.timestamp || 0;
        return bTime - aTime; // Most recent first
      }
      
      return 0;
    });
  }, [oppositeGender, onlineUser, lastMessages, currentUserData]);

  return (
    <div className="h-full">
      
      {loading ? (
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        sortedUsers &&
        sortedUsers.map((p) => {
          const isOnline =
            Array.isArray(onlineUser) && onlineUser.includes(p._id);
          const matched = isMatched(p._id);
          return (
            <div 
              key={p._id} 
              className={`chat-list-item ${matched ? 'matched-user' : ''}`}
              onClick={(e) => handleSetReceiver(p, e)}
            >
              <div className="chat-avatar-container">
                <img
                  src={getProfileImage(p)}
                  alt={p.name}
                  className={`chat-avatar ${isOnline ? 'online' : ''}`}
                />
                {matched && (
                  <div className="match-badge" title="Coffee Match!">
                    💕
                  </div>
                )}
                {isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <h3 className="chat-name">{p.name}</h3>
                  {lastMessages[p._id] && (
                    <span className="chat-time">
                      {formatTime(lastMessages[p._id].timestamp)}
                    </span>
                  )}
                </div>
                <div className="chat-last-message">
                  {getLastMessage(p._id)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ChatLisst;
