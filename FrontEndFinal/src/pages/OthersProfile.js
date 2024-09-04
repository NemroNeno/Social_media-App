import React, { useEffect, useState } from "react";
import Chahat from "../img/ChahatFateh.png";
import Block from "../img/Block.png";
import Follow from "../img/Checked User Male.png";
import { useParams } from "react-router-dom";
import axios from "axios";

const OthersProfile = () => {
  const [userData, setUserData] = useState();
  const params = useParams();

  const getInfo = async () => {
    try {
      console.log("this is working so much");
      const res = await axios.get(
        `http://localhost:3001/api/users/u/@${params.username}/profile`
      );
      console.log(res);
      setUserData(res.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const [followers] = useState([
    {
      name: "Ahmad",
    },
    {
      name: "Mohsin",
    },
    {
      name: "Khuzaima",
    },
    {
      name: "Afreen",
    },
    {
      name: "Ahmad",
    },
    {
      name: "Mohsin",
    },
    {
      name: "Khuzaima",
    },
    {
      name: "Afreen",
    },
  ]);
  const [following] = useState([
    {
      name: "Abdullah",
    },
    {
      name: "Farooq",
    },
    {
      name: "Burhan",
    },
    {
      name: "Polka",
    },
  ]);
  useEffect(() => {
    getInfo();
    console.log("use effect being called");
  }, []);
  return (
    <div className="h-fit w-screen flex flex-col items-center bg-blue-200 overflow-y-auto">
      <a
        class=" justify-center items-center flex w-2/5 rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 my-3"
        href="/homepost"
      >
        Return to Home Page
      </a>

      <div className="flex flex-row w-11/12 items-center">
        <span className="flex-1 h-1 bg-black" />
        <p className="flex text-6xl my-7 tracking-widest font-semibold font-serif mx-8">
          PROFILE PAGE
        </p>
        <span className="flex-1 h-1 bg-black" />
      </div>

      {/* Username and Display Name and Image */}
      <div className="flex flex-row h-2/5 w-11/12 bg-white my-2 mx-10 items-center p-6 border-2 border-gray-100 shadow-lg hover:shadow-2xl rounded-3xl">
        <div className="h-4/6 p-4 bg-white">
          <img
            src={userData?.image_url?userData?.image_url:Chahat}
            alt="Chahat Fateh Ali Khan"
            className="border-2 border-gray-800 rounded-2xl h-32 w-auto shadow-2xl"
          />
        </div>
        <span className="w-10" />
        <div className="flex-1 flex-col">
          <p className="text-3xl font-semibold font-serif text-gray-700">
            {userData?.username}
          </p>
          <span className="h-32 w-32" />
          <p className="text-xl font-light font-serif text-gray-500">
            @ {userData?.username}
          </p>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col hover:border-blue-300 border-0 hover:border-4 bg-white mr-10 hover:bg-yellow-200 focus:bg-blue-200 scale-80 cursor-pointer w-auto h-2/3 px-3">
            <img src={Follow} alt="Follow logo" />
            <button className="text-xl font-medium text-black">Follow</button>
          </div>
          <div className="flex flex-col hover:border-blue-300 border-0 hover:border-4 bg-white mr-10 hover:bg-yellow-200 focus:bg-blue-200 scale-80 cursor-pointer w-auto h-2/3 px-3">
            <img src={Block} alt="Blocking logo" />
            <button className="text-xl font-medium text-red-600">Block</button>
          </div>
        </div>
      </div>
      {/* Followers and Following */}
      <div className="flex flex-row gap-6 h-1/2 w-11/12 mx-10 my-5">
        <div className="w-1/2 h-40 bg-green-400 justify-center items-center flex flex-col shadow-xl gap-5 rounded-l-full">
          <p className="text-5xl font-black">{userData?.followers}</p>
          <p className="text-4xl font-light font-serif">Followers</p>
        </div>
        <div className="w-1/2 h-40 bg-green-400 justify-center items-center flex flex-col shadow-xl gap-5 rounded-r-full">
          <p className="text-5xl font-black">{userData?.following}</p>
          <p className="text-4xl font-light font-serif">Following</p>
        </div>
      </div>

      {/* Followers and Following list */}
      <div className="flex flex-row gap-6 w-11/12 h-96 mx-10 my-5 items-start justify-center bg-blue-200">
        <div className="w-1/3 h-96 bg-white overflow-y-scroll m-3">
          {followers?.map((follower, index) => (
            <div
              onClick={() => {}}
              key={index}
              className="w-full h-20 shadow-xl flex items-center justify-center font-semibold font-mono text-xl mb-2 border-2 border-black cursor-pointer hover:bg-yellow-100"
            >
              <p className="tracking-wider">{follower?.name}</p>
            </div>
          ))}
        </div>
        <div className="w-1/3 h-96 bg-white overflow-y-scroll m-3">
          {following?.map((follower, index) => (
            <div
              onClick={() => {}}
              key={index}
              className="w-full h-20 shadow-xl flex items-center justify-center font-semibold font-mono text-xl mb-2 border-2 border-black cursor-pointer hover:bg-yellow-100"
            >
              <p className="tracking-wider">static</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OthersProfile;
