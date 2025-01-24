import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND;
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Connect to your backend Socket.IO server
    const socket = io(BACKEND_URL, {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
