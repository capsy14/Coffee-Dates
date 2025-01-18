import React, { useEffect, useState } from "react";
import { getUser, logOut } from "../services/services";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectName } from "../redux/slice/userSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";

export default function UserProfile() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const namee = useSelector(selectName);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getUser();
        // console.log("this is res ", res);
        // console.log(res?.name); // Using optional chaining to avoid undefined errors
        if (!res) {
          toast.error("Some error occurred");
          navigate("/login");
          window.location.reload();
        } else {
          // console.log("checking ", res);
          setUserData(res);
          setLoading(false);
        }
        // console.log(res);
      } catch (error) {
        console.error(error);
        navigate("/login");
        window.location.reload();
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  const logOutUser = async () => {
    try {
      localStorage.setItem("isLoggedIn", false);
      await logOut();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const { name, email, phone, bio, photo, gender } = userData;

  return (
    <section className="bg-gray-200 py-5 h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
            <div className="flex justify-center">
              <img
                src={
                  photo
                    ? photo
                    : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                }
                alt="avatar"
                className="rounded-full w-56 h-56 object-cover mb-4"
              />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{name}</p>
              <p className="text-gray-600 text-lg">{phone} </p>
              <p className="text-gray-600 text-lg">{gender} </p>
              <p className="text-gray-600 text-lg">{email} </p>
            </div>

            <div className="mb-4 mt-3">
              <p className="text-gray-700 text-lg">Bio: {bio}</p>
            </div>

            <div className="flex justify-between">
              <Link to="/profile/edit">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                  Edit Profile
                </button>
              </Link>
              {/* <Link to="/changepass">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                  Change Password
                </button>
              </Link> */}
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={logOutUser}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
