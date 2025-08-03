import React, { useEffect, useRef, useState } from "react";
import { ChatItem, MessageBox } from "react-chat-elements";
import { useSelector } from "react-redux";
import { getUser } from "../services/services";
import { Input } from "react-chat-elements";
import EmojiPicker from "emoji-picker-react";
import emoji from "../../public/emoji.png";
import { socket } from "../App";
import { useGetMessages, useSendMessage } from "../services/chatServices";
function ChatItems() {
  const { receiver, receiverName, receiverPhoto, receiverEmail } = useSelector(
    (state) => state.receiver
  );
  const [isEmojiOpen, setEmojiOpen] = useState(false);
  const [seName, setseName] = useState("");
  const [seId, setseId] = useState("");
  const [text, setText] = useState("");
  const endRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { messages, loading, error } = useGetMessages();
  const { sendMessage, sending } = useSendMessage();
  const [onlineUser, setOnlineUser] = useState([]);

  // Smooth scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
    // Fallback to endRef scroll
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // Auto-scroll when switching to a different chat
  useEffect(() => {
    if (receiver) {
      setTimeout(scrollToBottom, 300); // Small delay to ensure messages are loaded
    }
  }, [receiver]);

  useEffect(() => {
    socket.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);
  const isOnline = Array.isArray(onlineUser) && onlineUser.includes(receiver);

  useEffect(() => {
    const fetchSender = async () => {
      const data = await getUser();
      setseId(data._id);
      setseName(data.name);
    };
    console.log(messages);
    fetchSender();
  }, []);
  const handleSend = async () => {
    if (!text.trim()) return;
    
    console.log(text);
    await sendMessage({
      messageContent: text,
      sender: seId,
    });
    setText("");
    
    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);
  };
  const handleEmoji = (e) => {
    setText(text + e.emoji);
    setEmojiOpen(!isEmojiOpen);
  };
  return (
    <>
      {/* Messages Container */}
      <div className="messages-container" ref={messagesContainerRef}>
        {loading ? (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          messages.map((e) => {
            const isSender = e.senderId == receiver ? false : true;
            return (
              <div
                key={e._id}
                className={`message-item ${isSender ? 'sent' : 'received'}`}
              >
                <div className={`message-bubble ${isSender ? 'sent' : 'received'}`}>
                  <p className="message-text">{e.message}</p>
                  <div className="message-time">
                    {new Date(e.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef}></div>
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={text}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim() !== "") {
              handleSend();
            }
          }}
          onChange={(e) => setText(e.target.value)}
        />
        
        <button className="emoji-btn" onClick={() => setEmojiOpen(!isEmojiOpen)}>
          <img src={emoji} alt="emoji" />
        </button>
        
        <div className="emoji-picker-container">
          <EmojiPicker open={isEmojiOpen} onEmojiClick={handleEmoji} />
        </div>
        
        <button 
          className="send-btn" 
          onClick={handleSend}
          disabled={!text.trim() || sending}
        >
          <span>☕</span>
          Send
        </button>
      </div>
    </>
  );
}

export default ChatItems;
