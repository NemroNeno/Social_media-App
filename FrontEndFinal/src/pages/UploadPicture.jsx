import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UploadPicture = () => {
  const location = useLocation();
 // const data = location.state;
 const data_page=location.state;
 console.log(data_page?.id,"this is recived from email page\n");
  const navig = useNavigate();
  const [image, setImage] = useState("");
  const handlePicUpload = async () => {
    try {
      if (!image) {
        alert("Please Upload your profile picture");
        return;
      }
      console.log(image);
      const data = new FormData();
      data.append("image", image);
      data.append("user_id", data_page.id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const res = await axios.post(
        "http://localhost:3001/api/users/profile/image",
        data,
        config
      );
      if (res?.data?.success) {
        alert("Welcome aboard, let the connections begin!")
        navig("/homePost");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-100vh h-screen  bg-[url('img/background_LOGIN.jpg')] !bg-opacity-0  flex justify-center items-center  ">
      <div className=" !bg-[#FFFFFFAA] w-6/12  h-3/6 ">
        <h1 className="font-bold text-2xl text-center underline underline-offset-8">
          Please Upload your profile picture to continue
        </h1>
        <p className="text-center font-medium py-8 text-xl w-5/12 mx-auto">
          <br />
          <p className="text-sm">The image should be under 2Mb's</p>
        </p>

        <input
          type="file"
          name="photo"
          accept="image/*"
          className=""
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />

        {image && (
          <div className="text-center">
            <img
              src={URL.createObjectURL(image)}
              alt="Product photo"
              height={"50px"}
              className="img img-responsive"
            />
          </div>
        )}

        <button
          onClick={handlePicUpload}
          class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 mx-72 my-8"
        >
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Upload your profile Picture
          </span>
        </button>

        <button
          onClick={()=>{
            alert("Welcome aboard, let the connections begin!")
            navig("/homepost")
          }}
          class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 mx-72 my-8"
        >
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            I will Upload it later !
          </span>
        </button>
      </div>
    </div>
  );
};

export default UploadPicture;
