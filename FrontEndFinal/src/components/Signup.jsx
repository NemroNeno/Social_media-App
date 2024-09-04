import React, { useEffect, useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import Datepicker from "react-tailwindcss-datepicker";
import axios from "axios";
import {useNavigate} from "react-router-dom"

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Spinner
} from "@chakra-ui/react";

const Signup = () => {
  const navigate=useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invertShow, setInvertShow] = useState();
  const [userNameTouched,setUserNameTouched]=useState(false);
  const [userNameCorrect,setUserNameCorrect]=useState(true);
  const [userNameMessage,setUserNameMessage]=useState("very short user name");
  const [emailVerified,setEmailVerified]=useState(false);
  const [realToken,setRealToken]=useState(null);
  const [cred, setCred] = useState({
    display_name: "",
    email: " ",
    password: " ",
    RePassword: " ",
    username: " ",
    dob:""
  });




  const handleChange = (e) => {
    const { name, value } = e.target;
    setCred({
      ...cred,
      [name]: value,
    });
    console.log(cred.dob);
    
  };

  const handlePasswordView = () => {
    setShow(!show);
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      if (
        !cred.display_name ||
        !cred.email ||
        !cred.password ||
        !cred.RePassword ||
        !cred.username ||
        !cred.dob
      ) {
        alert("fill in all the fields");
        setLoading(false);
        return;
      }




      const res= await axios.post("http://localhost:3001/api/auth/reset",{email:cred.email,mode:0}); 
      if(res?.data?.success){

        const data={
          cred:cred,
          realToken:res?.data?.code
        }
        navigate('/email',{state:data});
      }     

      
       
     
      
    } catch (error) {
      console.log(error);
    }
   
  };

const CheckUserName=async(req,res)=>{

  try {
    if(cred.username.length<3)
    {
            setUserNameTouched(false)


          
          
      return;
    }
    setUserNameTouched(true);
    const res= await axios.post("http://localhost:3001/api/auth/checkUserName",{username:cred.username});
    console.log(cred.username);
    //console.log(res);
    if(res?.data.success){
      setUserNameCorrect(true);
      setUserNameMessage("Correct user name")
      console.log(res?.data.success)
    }
    else{
      setUserNameCorrect(false);
      setUserNameMessage(" user-name already in use") 
      console.log(res?.data.success)
    }


  } catch (error) {
    console.log(error);
  }

}

useEffect(()=>{
  const identifier=setTimeout(()=>{
    
    CheckUserName();
   }, 1500);

   return () =>{
      clearTimeout(identifier);  
   };

},[cred.username])


  const handleClicked = () => {
    console.log("clicked fro");
  };

  return (
    <div className="h-5/6">
    <VStack spacing="5px" className="overflow-y-auto h-96 w-max no-scrollbar mx-auto ">
      <FormControl id="name" isRequired className="pb-20 p-10 w-max">
        <FormLabel className="text-3xl pl-32 text-red-900 w-max">
          Full-Name
        </FormLabel>
        <Input
          className="text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-max text-black"
          name="display_name"
          type={"text"}
          placeholder="Enter Your Full Name        "
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="user_name" isRequired className="pb-10 p-5 w-max ">
      <div className="relative w-full" >
        <FormLabel className="text-3xl pl-32 text-red-900 w-max ">
          User Name
        </FormLabel>
        <Input
         
          className={userNameTouched?userNameCorrect?("text-3xl placeholder:text-black-800 rounded  w-max bg-green-200 border border-green-900 text-green-900  z-10"):("text-3xl placeholder:text-black-800 rounded  w-max bg-red-200 border border-red-900 text-red-900  z-10"):"text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-max text-black z-10"}
          name="username"
          type={"text"}
          placeholder="Enter Your user name"
          onChange={handleChange}
        />
        <div className="text-xl absolute top-20 right-16 w-68 h-12 ml-1 text-red-700 flex items-center justify-center z-0">{userNameTouched?(userNameMessage):(<p></p>)}</div>
         </div>
      </FormControl>
      <FormControl id="email" isRequired className="pb-20 p-10 w-max">
        <FormLabel className="text-3xl pl-32 text-red-900 w-max">
          Email
        </FormLabel>
        <Input
           className="text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-max text-black "
          name="email"
          type={"email"}
          placeholder="Enter Your Email "
          onChange={handleChange}
        />
      </FormControl>






      <FormControl id="date" isRequired className="pb-20 p-10 w-max">
        <FormLabel className="text-3xl  text-red-900 w-max text-center">
          Date of Birth
        </FormLabel>
        <Input
           className="text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-max text-black "
          name="dob"
          type={"date"}
          placeholder="Enter Your date of birth "
          onChange={handleChange}
        />
      </FormControl>

















      <FormControl
        id="password"
        className="text-3xl pl-30 w-max pb-20"
        isRequired
      >
        <FormLabel className="text-3xl pl-20 text-red-900">
          Enter Password
        </FormLabel>
        <InputGroup>
          <Input
            className="text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-max text-black "
            name="password"
            type={show ? "text" : "password"}
            placeholder=""
            onChange={handleChange}
            size={30}
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

      <FormControl
        id="Repassword"
        className="text-3xl pl-30 w-max pb-20"
        isRequired
      >
        <FormLabel className="text-3xl pl-20 text-red-900">
          {" "}
          Re Enter Password
        </FormLabel>
        <InputGroup>
          <Input
            className="text-3xl placeholder:text-red-800 rounded border-zinc-700 bg-gray-400 w-max text-black "
            name="RePassword"
            type={show ? "text" : "password"}
            placeholder=""
            onChange={handleChange}
            size={30}
          />
          <InputRightElement className="">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handlePasswordView}
              className={loading?"text-xl bg-red-500 hover:bg-blue-700 text-white font-bold  rounded":"text-xl bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded"}
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
        onClick={handleSignUp}
        isLoading={loading}
        className="text-xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
      
      {!loading?(<>Signup</>):(<Spinner/>)}
      </Button>
    </VStack>
    </div>
  );
};

export default Signup;
