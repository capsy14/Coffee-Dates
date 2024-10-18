import React from "react";
import { toast } from "react-toastify";

const ImageIcon = (props) => {
  const cloudinary_url = import.meta.env.VITE_APP_CLOUDINARY;
  const cloud_name = import.meta.env.VITE_APP_CLOUDINARY_CLOUD;
  const preset_name = import.meta.env.VITE_APP_CLOUDINARY_PRESET;

  const handleFileChange = async (e) => {
    const profileImage = e.target.files[0];
    // Do something with the selected file
    console.log("Selected file:", profileImage);

    let imageURL;
    if (
      profileImage &&
      (profileImage.type === "image/jpeg" ||
        profileImage.type === "image/jpg" ||
        profileImage.type === "image/png")
    ) {
      const image = new FormData();
      image.append("file", profileImage);
      image.append("cloud_name", cloud_name);
      image.append("upload_preset", preset_name);

      // First save image to cloudinary
      const response = await fetch(`${cloudinary_url}`, {
        method: "post",
        body: image,
      });
      if (!response) {
        toast.error("Image not uploaded");
        return;
      }
      const imgData = await response.json();
      //   console.log(imgData.secure_url);
      imageURL = imgData?.url.toString();
      props.setPhotoLink(imageURL);
      console.log(imageURL);
    }
  };

  return (
    <label className="w-10 h-fit  opacity-80  absolute hover:opacity-100 hover:scale-110">
      <input
        type="file"
        name=""
        id=""
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        id="Upload"
        className=""
        fill="#34a853"
        className="color000000 svgShape"
      >
        <path d="M398.1 233.2c0-1.2.2-2.4.2-3.6 0-65-51.8-117.6-115.7-117.6-46.1 0-85.7 27.4-104.3 67-8.1-4.1-17.2-6.5-26.8-6.5-29.5 0-54.1 21.9-58.8 50.5C57.3 235.2 32 269.1 32 309c0 50.2 40.1 91 89.5 91H224v-80h-48.2l80.2-83.7 80.2 83.6H288v80h110.3c45.2 0 81.7-37.5 81.7-83.4 0-45.9-36.7-83.2-81.9-83.3z"></path>
      </svg>
    </label>
  );
};

export default ImageIcon;
