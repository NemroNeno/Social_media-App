import React, { useEffect } from "react";

import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useAuth } from "../components/contexts/authContext";

const Hompage = () => {
  const [auth,setAuth]=useAuth();

  useEffect(()=>{
      //console.log("use Auth is working");
      //console.log(auth);
  },[auth])


  return (
    <div className="w-100vh h-screen bg-white flex flex-col  justify-center items-center">
      <div className="font-serif text-slate-900 font-semibold py-5 text-center">
        <p className="bg-slate-50 py-3 text-5xl font-mono border-2 border-slate-200">Connectify</p>
        <Box
          w="100%"
          h="60vh"
          bg={"white"}
          className="w-11/12 border-2 border-slate-200 bg-yellow-50  !p-14 !pt-5"
          borderRadius="lg"
          borderWidth="1px"
          width="100vh"
          p={4}
        >
          <Tabs variant="soft-rounded" colorScheme="blue" className="">
            <TabList className="bg-yellow-100 rounded-full items-center flex">
              <Tab
                w="50%"
                className="text-3xl text-red-950  hover:text-green-600 focus:text-green-800 focus:bg-blue-100 font-mono focus:rounded-full focus:border-2 border-black"
              >
                Login
              </Tab>
              <Tab
                w="50%"
                className="text-3xl text-red-950  hover:text-green-600 focus:text-green-800 focus:bg-blue-100 font-mono focus:rounded-full focus:border-2 border-black"
              >
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </div>
    </div>
  );
};

export default Hompage;
