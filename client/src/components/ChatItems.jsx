import React, { useEffect, useRef, useState } from "react";
import { ChatItem, MessageBox } from "react-chat-elements";
import { useSelector } from "react-redux";
import { getUser } from "../services/services";
import { Input } from "react-chat-elements";
import EmojiPicker from "emoji-picker-react";
import emoji from "../../public/emoji.png";
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
  const { messages, loading, error } = useGetMessages();
  const { sendMessage, sending } = useSendMessage();
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  //yenha dalna hai kis change pe
  useEffect(() => {
    const fetchSender = async () => {
      const data = await getUser();
      setseId(data._id);
      setseName(data.name);
    };
    console.log(messages);
    fetchSender();
  }, []);
  const handleSend = () => {
    console.log(text);
    sendMessage(text);
    setText("");
  };
  const handleEmoji = (e) => {
    setText(text + e.emoji);
    setEmojiOpen(!isEmojiOpen);
  };
  return (
    <div className="w-full">
      <div className="flex  border-2 items-center gap-5 p-3 pl-14 md:p-3">
        <img
          src={receiverPhoto}
          alt=""
          className="w-16 h-16 rounded-full border-4"
        />
        <div>
          <h1 className="text-lg font-semibold"> {receiverName} </h1>
          <span className=" text-base text-slate-500">Online </span>
        </div>
      </div>
      <div className="sm:p-4 p-1 lg:h-[66vh]  md:h-[60vh] h-[63vh] overflow-y-scroll overflow-x-hidden">
        {messages.map((e) => {
          const isSender = e.senderId == receiver ? false : true;
          return (
            <MessageBox
              position={isSender ? "right" : "left"}
              key={e._id}
              title={isSender ? seName : receiverName}
              type="text"
              text={e.message}
            />
          );
        })}
        <div ref={endRef}></div>
      </div>
      <div className=" flex gap-5 p-1 sm:p-3 md:ml-11  sm:pl-5">
        <input
          type="text"
          className=" border-3 border-lime-300 w-2/3 bg-[#ECE4CF] p-2 rounded-md "
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <img src={emoji} alt="" onClick={() => setEmojiOpen(!isEmojiOpen)} />
        <div className="absolute right-2 top-11 md:top-50 lg:top-53  z-10">
          <EmojiPicker open={isEmojiOpen} onEmojiClick={handleEmoji} />
        </div>
        <button className="bg-[#DEB887]" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatItems;
