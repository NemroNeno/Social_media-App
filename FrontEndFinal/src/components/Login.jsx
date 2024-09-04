import React, { useContext, useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "./contexts/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navig = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingForgetPassword, setLoadingForgetPassword] = useState(false);
  const [invertShow, setInvertShow] = useState();
  const [
    auth,
    setAuth,
    selectedChat,
    setSelectedChat,
    UserChats,
    setUserChats,
  ] = useAuth();
  const [cred, setCred] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCred({
      ...cred,
      [name]: value,
    });
  };

  const handlePasswordView = () => {
    setShow(!show);
  };

  const handleLogin = async () => {
    if (!cred.username || !cred.password) {
      setLoading(false);
      alert("Enter all the fields");
      return;
    }

    setLoading(true);

    const res = await axios.post("http://localhost:3001/api/auth/login", cred);

    if (res?.data?.success) {
      console.log(res.data);
      setLoading(false);

      navig("/homePost");
      setAuth({
        ...auth,
        user: res?.data?.user,
        token: res?.data?.token,
      });
      localStorage.setItem("db_user", JSON.stringify(res?.data));

      alert(res?.data?.message);
    } else {
      //console.log('console loging from thee')
      setCred({
        username: "",
        password: "",
      });

      setLoading(false);
      alert(res?.data?.message);
    }
  };

  const forgetPassword = async () => {
    try {
      if (!cred.username) {
        alert("Enter Email and password");
        return;
      }

      const res = await axios.post("http://localhost:3001/api/auth/reset", {
        email: cred.username,
        mode: 1,
      });
      if (res?.data?.success) {
        const data = {
          email: cred.username,
          realToken: res?.data?.code,
        };
        navig("/forgetPassword", { state: data });
      } else {
        alert("No account exists for the given email");
        setCred({
          username: "",
          pasword: "",
        });
        navig("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-fit overflow-y-auto">
      <VStack spacing="5px" className="align-top w-full bg-slate-100">
        <FormControl id="email" isRequired className="pb-20 p-10 w-full">
          <FormLabel className="text-3xl w-full mx-3 text-center">
            Enter Email
          </FormLabel>
          <Input
            className="text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-full ml-4 text-black"
            name="username"
            type={"email"}
            placeholder="Enter Your Email         "
            onChange={handleChange}
            value={cred.username}
          />
        </FormControl>

        <FormControl id="password" className=" p-10 w-full" isRequired>
          <FormLabel className="text-3xl w-full mx-3 text-center ">
            Enter Password
          </FormLabel>
          <InputGroup>
            <Input
              className="text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-full text-black ml-4"
              name="password"
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={handleChange}
              size={30}
              value={cred.password}
            />
            <InputRightElement className="">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handlePasswordView}
                className="text-xl bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded"
              >
                <ViewIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          width="50%"
          colorScheme="green"
          style={{ marginTop: 15 }}
          onClick={handleLogin}
          isLoading={loading}
          className={
            loading
              ? "text-xl bg-red-500 text-white font-bold  rounded"
              : "text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded"
          }
        >
          Login
        </Button>
        <Button
          width="50%"
          colorScheme="red"
          style={{ marginTop: 15 }}
          onClick={forgetPassword}
          isLoading={loadingForgetPassword}
          className={
            loadingForgetPassword
              ? "text-xl bg-red-500 text-white font-bold  rounded mb-5"
              : "text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded mb-5"
          }
        >
          Forgot Password
        </Button>
      </VStack>
    </div>
  );
};

export default Login;
