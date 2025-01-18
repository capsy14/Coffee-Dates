import React, { useEffect, useState } from "react";
import { ChatList } from "react-chat-elements";
import { oppositeGenderProfile } from "../services/services";
import "react-chat-elements/dist/main.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setReceiver,
  setReceiverEmail,
  setReceiverPhoto,
  setReceiverName,
} from "../redux/slice/receiverSlice";
function ChatLisst() {
  const [oppositeGender, setOppositeGender] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const defaultMaleImage =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
  const defaultFemaleImage =
    "https://icon2.cleanpng.com/lnd/20240714/aft/a81tg9lau.webp";
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await oppositeGenderProfile();
        setOppositeGender(res);
        // console.log("Data from API:", res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
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
  const handleSetReceiver = (p) => {
    if (!p) {
      console.warn("setReceiver was called with an undefined or null object");
      return;
    }

    // console.log(p._id);
    dispatch(setReceiver(p._id));
    dispatch(setReceiverName(p.name));
    dispatch(setReceiverEmail(p.email));
    const imgdata = getProfileImage(p);
    // console.log(imgdata);
    dispatch(setReceiverPhoto(imgdata));
  };

  return (
    <div
      style={{
        height: "86vh",
      }}
      className=" w-full md:w-[40vw]  lg:w-[30vw] p-3  overflow-scroll overflow-x-hidden"
    >
      {oppositeGender &&
        oppositeGender.map((p) => (
          <div className=" ">
            <ChatList
              className="chat-list"
              key={p._id}
              onClick={() => handleSetReceiver(p)}
              dataSource={[
                {
                  avatar: `${getProfileImage(p)}`,
                  alt: p.name,
                  title: p.name,
                  subtitle: `${p.email}`,
                  date: new Date(),
                  unread: 0,
                },
              ]}
            />
          </div>
        ))}
    </div>
  );
}

export default ChatLisst;
