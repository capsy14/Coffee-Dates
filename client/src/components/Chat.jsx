import React, { useEffect, useState, useReducer, useCallback } from "react";
import Gun from "gun";
import "../styles/chat.css";

const gun = Gun({
  peers: ["https://localhost:3030/gun"],
});

const initialState = {
  messages: [],
};

function reducer(state, action) {
  if (action.type === "ADD_MESSAGE") {
    return {
      messages: [action.message, ...state.messages],
    };
  }
  return state;
}

const Chat = ({ account }) => {
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const messages = gun.get("messages");
    const listener = messages.map().on((m) => {
      dispatch({
        type: "ADD_MESSAGE",
        message: {
          name: m.name,
          message: m.message,
          createdAt: m.createdAt,
        },
      });
    });

    return () => {
      listener.off(); // Unsubscribe when component unmounts
    };
  }, []);

  const onChange = (e) => {
    setForm({ ...formState, [e.target.name]: e.target.value });
  };

  const saveMessage = useCallback(() => {
    const messages = gun.get("messages");
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now(),
    });
    setForm({
      name: "",
      message: "",
    });
  }, [formState]);

  return (
    <>
      <div className="container">
        <div className="dil"></div>
        <h1>Decentralized Chat App using Gun js</h1>

        <h1>Connected Account is {account}</h1>
        <div className="input-container">
          <input
            className="input-field"
            onChange={onChange}
            placeholder="Name"
            name="name"
            value={formState.name}
          />
          <br />
          <br />
          <input
            className="input-field"
            onChange={onChange}
            placeholder="Message"
            name="message"
            value={formState.message}
          />
          <br />
          <br />
          <button className="send-button" onClick={saveMessage}>
            Send Message
          </button>
        </div>
        <div className="message-container">
          {state.messages.map((message) => (
            <div className="message" key={message.createdAt}>
              <div className="message-content">
                <h3 className="message-sender">
                  {message.name} Address: {account}
                </h3>
                <p className="message-text">{message.message}</p>
                <p className="message-time">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Chat;
