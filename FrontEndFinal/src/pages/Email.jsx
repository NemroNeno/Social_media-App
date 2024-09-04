import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../components/contexts/authContext";
import io  from 'socket.io-client';

const Email = () => {
  const navig=useNavigate();
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState(0);
  const location = useLocation();
  const data = location.state;
  const [auth, setAuth] = useAuth();
  const cred = data.cred;

  

  const handleChange = (e) => {
    setUserToken(e.target.value);
  };

  const completeSignUp = async () => {
    try {
      if (userToken != data.realToken) {
        alert("Wrong token is entered! re-enter the token!");
        return;
      }
      // setLoading(true);
     // console.log(cred);
      const res = await axios.post(
        "http://localhost:3001/api/auth/signup",{cred}
       
        );
      if (res?.data.success) {
        setLoading(false);
        alert(res?.data.message);
        setAuth({...auth,
          user:res?.data?.user,
          token:res?.data?.token});
        console.log(res?.data.user.id,'this will be passed to picture page');
        const data_page={id:res?.data?.user?.id}
        navig("/picUpload",{state:data_page})
      } else {
        setLoading(false);
        alert(res?.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="w-100vh h-screen  bg-[url('img/background_LOGIN.jpg')] !bg-opacity-0  flex justify-center items-center  ">
      <div className=" !bg-[#FFFFFFAA] w-6/12  h-3/6 ">
        <h1 className="font-bold text-2xl text-center underline underline-offset-8">
          Verify your Email
        </h1>
        <p className="text-center font-medium py-8 text-xl w-5/12 mx-auto">
          Enter the token we have just sent to your email {cred.email}
          <br />
          <p className="text-sm">
            It may take 2 minutes for verification mail sent to you{" "}
          </p>
        </p>
        <input
          placeholder="Enter the received token"
          className="w-8/12 mx-28 h-1/6 border rounder placeholder:text-2xl placeholder:text-center text-center text-2xl"
          name="userToken"
          type="number"
          onChange={handleChange}
        />

        <button
          class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 mx-72 my-8"
          onClick={completeSignUp}
        >
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Verify your Email
          </span>
        </button>
      </div>
    </div>
  );
};

export default Email;
