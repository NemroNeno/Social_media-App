// TopBarApp.js
import React, { useState } from "react";
import logoConnectify from "../img/logoConnectify.png";
import chatBubble from "../img/Chat Bubble.png";
import Logout from "../img/Logout.png";
import { useNavigate } from "react-router-dom";
import Search from "../img/Search.png";
import Chahat from "../img/Chahat.png";
import "../pages/styles.css";
import { FaBars, FaTimesCircle } from "react-icons/fa";
import OverlayWrapper from "./OverlayWrapper";
import GroupAdd from "../img/Group add.png";
import SearchComponent from "./SearchComponent";
import { useAuth } from "./contexts/authContext";
import axios from "axios";

const TopBarApp = ({ isPosts, isChats, isGroup, children }) => {
  const [postsOverlay, setPostsOverlay] = useState(false);
  const [chatsOverlay, setChatsOverlay] = useState(false);
  const [groupOverlay, setGroupOverlay] = useState(false);

  const [filteredCandidates, setFilteredCandidates] = useState([
    "Username",
    "Qaim",
    "Qasim",
    "Ibrahim",
  ]);
  const [inputValue, setInputValue] = useState("");
  const [participantsList, setParticipantslist] = useState([]);
  const [chatsParticipantsList, setChatsParticipantsList] = useState([""]);
  const [groupName, setGroupName] = useState("");

  const [
    auth,
    setAuth,
    selectedChat,
    setSelectedChat,
    UserChats,
    setUserChats,
    chat,
    setChat,
    allPosts,
    setAllPost,
    currentSelectedPost,
    setCurrentSelectedPost,
    CurrentCommentPost,
    setCurrentCommentPost,
    messages,
    setMessages,
  ] = useAuth();

  const groupNameHandler = (e) => {
    setGroupName(e.target.value);
  };
  const navigate = useNavigate();
  const getUserChats = async () => {
    try {
      if (!auth) return;
      const res = await axios.post(
        "http://localhost:3001/api/chats/getUserChats",
        { user_id: auth.user.id },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      setUserChats([...res?.data?.chats]);
      console.log(res?.data?.chats);
    } catch (error) {
      console.log(error);
    }
  };

  const newChatAdder = async (user) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/chats/dm_with/u/${user.username}`,
        { user1: auth.username },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      if (res?.data?.new) {
        console.log("working ok now");
        await getUserChats();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const groupCreator = async () => {
    try {
      if (!participantsList) {
        alert("Empty group can't be created ");
        return;
      }
      //  setParticipantslist([...participantsList, {id:auth.user.id,username:auth.user.username}])
      console.log(participantsList);
      const res = await axios.post(
        "http://localhost:3001/api/group/create",
        {
          members: participantsList,
          group_name: groupName,
          private_group: false,
          user_id: auth.user.id,
          admin: auth.user,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (res?.data?.success) {
        setGroupOverlay(false);
        await getUserChats();
        alert("Group Created Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutFunc = () => {
    setAuth({
      user: "",
      token: "",
    });
    localStorage.removeItem("db_user");

    navigate("/");
  };

  const navig = () => {
    navigate("/");
    console.log("clicked");
  };
  const navigChats = () => {
    navigate("/chatApp");
  }

  const navigProfile = () => {
    navigate("/Profile");
  }

  const navigPosts = () => {
    navigate("/homepost");
  }

  const handleButtonClick = () => {
    if (isChats) {
      setChatsOverlay(true);
    } else {
      setPostsOverlay(true);
    }
  };

  const participantsListHandler = (e) => {
    const exist = participantsList.find((o) => o.id === e.id);
    if (exist) {
      const updatedArray = participantsList.filter((obj) => obj.id !== e.id);
      setParticipantslist(updatedArray);
      return;
    }
    setParticipantslist([...participantsList, e]);
  };

  return (
    <>
      <div className="h-15 bg-teal-300 flex justify-between items-center pr-3 pl-3 sticky">
        <div className="flex flex-rows items-center justify-between m-2">
          <img
            src={logoConnectify}
            alt="Connectify Logo"
            className="h-12"
            onClick={navig}
          />
          <button key="Search" onClick={handleButtonClick} className="ml-3">
            <img src={Search} alt="search logo" className="h-11 w-11" />
          </button>
          {isChats && (
            <button
              key="GroupCreation"
              className="ml-3"
              onClick={() => setGroupOverlay(true)}
            >
              <img src={GroupAdd} alt="search logo" className="h-11 w-11" />
            </button>
          )}
        </div>
        <div className="justify-center items-center space-x-4">
          <button key="posts" onClick={(isPosts)?(navigChats):(navigPosts)}>
            <img
              src={chatBubble}
              alt="chat logo"
              className="h-12 w-10 p-0"
            ></img>
          </button>
          <button key="profile" onClick={navigProfile}>
            <img
              src={auth?.user?.image_url?auth?.user?.image_url:Chahat}
              alt="chahatFateh"
              className="h-12 w-12 p-0 border-black border-2 rounded-full"
            />
          </button>
          <button key="logout" onClick={logoutFunc}>
            <img src={Logout} alt="chat logo" className="h-12 w-10 p-0"></img>
          </button>
        </div>
      </div>
      {children}
      {/* this is the search for DM  */}
      {chatsOverlay && (
        <OverlayWrapper
          Open={chatsOverlay}
          closeFunction={() => setChatsOverlay(false)}
        >
          <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
                      <p className="text-5xl flex justify-center mb-7 font-extrabold">
                        Search and Add Chats
                      </p>
                      
          <div>
            <SearchComponent onSelection={newChatAdder} isGroup={false} />
          </div>
          </div>
        </OverlayWrapper>
      )}

      {/* this for the post search page this will only appear in Post page   */}
      {postsOverlay && (
        <OverlayWrapper
          Open={postsOverlay}
          closeFunction={() => setPostsOverlay(false)}
        >
          <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
                      <p className="text-5xl flex justify-center mb-7 font-extrabold">
                        Create Group
                      </p>
          <div>
            <p>Something Posts in the way</p>
          </div>
          </div>
        </OverlayWrapper>
      )}

      {groupOverlay && (
        <OverlayWrapper
          Open={groupOverlay}
          closeFunction={() => {
            setFilteredCandidates([]);
            setInputValue("");
            setParticipantslist([]);
            setGroupOverlay(false);
          }}
        >
          <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
                      <p className="text-5xl flex justify-center mb-7 font-extrabold">
                        Create Group
                      </p>
          <div className=" ml-6 flex flex-col">
            <h2 className="text-2xl justify-start font-semibold font-mono">Group-Name</h2>
            <input
              placeholder="Enter group name!"
              name="groupName"
              value={groupName}
              className="w-9/12 h-10 p-3 mb-10 border-black border-2 ml-2 flex justify-center"
              onChange={groupNameHandler}
            />
            <p className="text-2xl justify-start font-semibold font-mono">Group Participants</p>
            <SearchComponent
              onSelection={participantsListHandler}
              selectedUsers={participantsList}
              setSelectedUsers={setParticipantslist}
              isGroup={true}
            />
            <p>List of participants</p>
            <div className="flex justify-center flex-wrap">
              {participantsList &&
                participantsList?.map((p, index) => (
                  <div
                    className="flex flex-row w-3/12 justify-center items-center rounded-full bg-pink-500 px-10 m-3"
                    key={index}
                    onClick={() => participantsListHandler(p)}
                  >
                    <p className="h-fit p-3 flex-1" key={index}>
                      {p.username}
                    </p>
                    <div className="h-2 w-2">
                      <FaTimesCircle className="" />
                    </div>
                  </div>
                ))}
            </div>
            <button className="bg-yellow-200 m-auto p-3 border-black border-2 hover:bg-blue-400" onClick={groupCreator}>
              Create Group
            </button>
          </div>
          </div>
        </OverlayWrapper>
      )}
    </>
  );
};

export default TopBarApp;

// import React, {useEffect, useState} from 'react'
// import logoConnectify from '../img/logoConnectify.png'; // Import the image
// import Button from '@mui/material/Button';
// import chatBubble from '../img/Chat Bubble.png';
// import Logout from '../img/Logout.png';
// import {useNavigate} from 'react-router-dom'
// import Search from '../img/Search.png';
// import Chahat from '../img/Chahat.png';
// import "../pages/styles.css";
// import {FaBars} from 'react-icons/fa'

// //Here you have to decide which page is currently going on, also we only got two states
// // State-1 Posts Page
// // State-2 Chats Page

// const TopBarApp = ({propsFunction, propsStateCurrentPage}) => {
//     const navigate=useNavigate();
//     const [isPostsPage, setPostPage] = useState(true);

//     useEffect(()=>{
//         setPostPage(propsStateCurrentPage);
//     }, [propsStateCurrentPage]);

//     //For Connectify logo
//     const navig=()=>{
//        navigate('/');
//        console.log('clicked');
//     }

//     //Function to decide if you are on Posts Page then for Select Button
//     const toggleSearchFunction= ()=>{
//         return (
//             (isPostsPage)?(<div onClick={propsFunction} className='fixed h-screen w-screen inset-0 z-10 flex justify-center items-center bg-black bg-opacity-60 cursor-pointer'>
//             <div className='w-1/2 h-2/5 z-50 m-3 p-4 flex flex-col justify-start border-black border-3 bg-slate-700'>
//                   <input className='w-9/12 h-10 border-black border-2 rounded-full p-3 ml-3 mr-3' placeholder='Start chat with...'/>
//                   <div className='m-4 flex flex-col'>
//                         {
//                             <p>Posts Search here</p>
//                         }
//                   </div>
//             </div>
//         </div>):(<div onClick={propsFunction} className='fixed h-screen w-screen inset-0 z-10 flex justify-center items-center bg-black bg-opacity-60 cursor-pointer'>
//             <div className='w-1/2 h-2/5 z-50 m-3 p-4 flex flex-col justify-start border-black border-3 bg-slate-700'>
//                   <input className='w-9/12 h-10 border-black border-2 rounded-full p-3 ml-3 mr-3' placeholder='Start chat with...'/>
//                   <div className='m-4 flex flex-col'>
//                         {
//                             <p>Friends or groups search here</p>
//                         }
//                   </div>
//             </div>
//         </div>)
//         );
//     }

//   return (
//     <div className='h-15 bg-teal-300 flex justify-between items-center pr-3 pl-3 '>
//         <div className='flex flex-rows m-0 items-center'>
//           <img src={logoConnectify} alt="Connectify Logo" className='h-12' onClick={navig}/> {/* Use the imported image */}
//           <Button variant='Search' onClick={toggleSearchFunction}><img src={Search} alt='search logo' className='h-11 w-11'/></Button>
//         </div>
//         <div>
//         <Button variant='Menu selection'><FaBars /></Button>
//           <Button variant='Chat bubble'><img src={chatBubble} alt='chat logo' className='h-12 w-10 p-0'></img></Button>
//           <Button variant='Profile'><img src={Chahat} alt='chahatFateh' className='h-12 w-12 p-0 border-black border-2 rounded-full' /></Button>
//           <Button variant='Logout'><img src={Logout} alt='chat logo' className='h-12 w-10 p-0'></img></Button>
//         </div>
//       </div>
//   )
// }

// export default TopBarApp
