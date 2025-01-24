// Frontend hook - useChat.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage, setMessage } from "../redux/slice/receiverSlice.js";
import { socket } from "../App.jsx";
import sound from "../../public/notification.wav";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND + "message";
export const useGetMessages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // Get receiver ID from Redux store
  const receiver = useSelector((state) => state.receiver.receiver);
  const messages = useSelector((state) => state.receiver.message || []);

  const checc = (newMessage) => {
    console.log("naya message aya hai ", newMessage);
    const notification = new Audio(sound);
    notification.play();

    // Ensure we're always working with an array
    dispatch(
      setMessage(
        Array.isArray(messages)
          ? [...messages, newMessage.message]
          : [newMessage.message]
      )
    );
  };

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      checc(newMessage);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiver) return;

      setLoading(true);
      try {
        const url = `${BACKEND_URL}/get/${receiver}`;
        const response = await axios.get(url);

        // Ensure we're setting an array
        dispatch(setMessage(Array.isArray(response.data) ? response.data : []));
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.message);
        dispatch(setMessage([])); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiver, dispatch]);

  return {
    messages: Array.isArray(messages) ? messages : [],
    loading,
    error,
  };
};
export const useSendMessage = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Get receiver ID and current messages from Redux store
  const receiver = useSelector((state) => state.receiver.receiver);
  const messages = useSelector((state) => state.receiver.message);

  const sendMessage = async (data) => {
    const { messageContent, sender } = data;
    console.log("send mess wala" + sender);
    if (!receiver || !messageContent) return;

    setSending(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/send/${receiver}`, {
        message: messageContent,
      });

      // Update messages in Redux store
      dispatch(setMessage([...messages, response.data]));
      console.log("before sendmessage");
      socket.emit("sendMessage", {
        senderId: sender,
        receiverId: receiver,
        message: response.data,
      });
      setSending(false);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
      setSending(false);
      throw error;
    }
  };

  return { sendMessage, sending, error };
};
