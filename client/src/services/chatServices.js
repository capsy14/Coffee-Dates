// Frontend hook - useChat.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../redux/slice/receiverSlice.js";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND + "/message";
export const useGetMessages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Get receiver ID from Redux store
  const receiver = useSelector((state) => state.receiver.receiver);
  const messages = useSelector((state) => state.receiver.message);

  useEffect(() => {
    const fetchMessages = async () => {
      // console.log("backend " + BACKEND_URL);
      if (!receiver) return;

      setLoading(true);
      try {
        const url = `${BACKEND_URL}/get/${receiver}`;
        console.log("url " + url);
        const response = await axios.get(url);
        // console.log(response.data);
        dispatch(setMessage(response.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiver, dispatch]);

  return { messages, loading, error };
};
export const useSendMessage = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Get receiver ID and current messages from Redux store
  const receiver = useSelector((state) => state.receiver.receiver);
  const messages = useSelector((state) => state.receiver.message);

  const sendMessage = async (messageContent) => {
    if (!receiver || !messageContent) return;

    setSending(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/send/${receiver}`, {
        message: messageContent,
      });

      // Update messages in Redux store
      dispatch(setMessage([...messages, response.data]));
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
