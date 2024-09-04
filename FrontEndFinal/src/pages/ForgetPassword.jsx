import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../components/contexts/authContext";
import io from "socket.io-client";

const ForgetPassword = () => {
  const navig = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState(0);
  const [newPass, setnewPass] = useState("");
  const [newPassConfirm, setnewPassConfirm] = useState("");
  const [validated, setValidated] = useState(false);
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const data = location.state;
  const email = data.email;
  const realToken = data.realToken;

  const handleChange = (e) => {
    setUserToken(e.target.value);
  };
  const checkToken = () => {
    if (userToken != data.realToken) {
      alert("Wrong token is entered! re-enter the token!");
      return;
    } else setValidated(true);
  };
  const ResetPassword = async () => {
    try {
      if (newPass != newPassConfirm) {
        alert(
          "Both passwords entered dont't match! please reconfirm both passwords\n"
        );
        return;
      }
      // setLoading(true);
      // console.log(cred);
      const res = await axios.post(
        "http://localhost:3001/api/auth/updatePassword",
        {
          email,
          password: newPass,
        }
      );
      if (res?.data.success) {
        setLoading(false);
        alert("password changed successfull !");
        navig("/");
      } else {
        setLoading(false);
        alert(res?.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleChangePass = (e) => {
    setnewPass(e.target.value);
  };

  const handleChangePassConfirm = (e) => {
    setnewPassConfirm(e.target.value);
  };
  return (
    <div className="w-100vh h-screen  bg-[url('img/background_LOGIN.jpg')] !bg-opacity-0  flex justify-center items-center  ">
      {validated ? (
        <div className=" !bg-[#FFFFFFAA] w-6/12  h-3/6 ">
          <h1 className="font-bold text-2xl text-center underline underline-offset-8">
            Reset Your Password be Re entering a new password
          </h1>

          <input
            placeholder="Enter new Password"
            className="w-8/12 mx-28 h-1/6 border rounder placeholder:text-2xl placeholder:text-center text-center text-2xl"
            name="newPass"
            type="password"
            value={newPass}
            onChange={handleChangePass}
          />
          <input
            placeholder="Confirm Password"
            className="w-8/12 mx-28 h-1/6 border rounder placeholder:text-2xl placeholder:text-center text-center text-2xl"
            name="newPassConfirm"
            type="password"
            value={newPassConfirm}
            onChange={handleChangePassConfirm}
          />

          <button
            class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 mx-72 my-8"
            onClick={ResetPassword}
          >
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Reset Password
            </span>
          </button>
        </div>
      ) : (
        <div className=" !bg-[#FFFFFFAA] w-6/12  h-3/6 ">
          <h1 className="font-bold text-2xl text-center underline underline-offset-8">
            A code has been sent your email
          </h1>
          <p className="text-center font-medium py-8 text-xl w-5/12 mx-auto">
            Enter the token we have just sent to your email for reseting the
            password {email}
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
            onClick={checkToken}
          >
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Reset Password
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
export default ForgetPassword;
