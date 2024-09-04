import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import "./ChatMessageListStyling.css";
import Send from "../img/Send.png";
import { useAuth } from "./contexts/authContext";
import axios from "axios";
import info from "../img/Info outline.png";
import { io } from "socket.io-client";
import ChatInfoOverlay from "./ChatInfoOverlay";
import OverlayWrapper from "./OverlayWrapper";
import OthersProfile from "../pages/OthersProfile";
import { Navigate, useNavigate } from "react-router-dom";

const ChatMessageList = () => {
  const ENDPOINT = "http://localhost:3001";

  const io = require("socket.io-client");
  const socket = io(ENDPOINT, {
    withCredentials: true,
  });

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
    group_info,
    setGroupInfo
  ] = useAuth();

  const [userId, setUserId] = useState(false);
  const [adminId, setGroupId] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [infoOverlay, setInfoOverlay] = useState(false);
  const [SelectedMessageOnMessageList, setSelectedMessageOnMessageList] =
    useState(null);

  const handler = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (event) => {
    try {
      if (!newMessage) return;
      if (event.key === "Enter") {
        console.log(selectedChat);
        const res = await axios.post(
          `http://localhost:3001/api/chats/messages/${selectedChat.chat_id}`,
          {
            content: newMessage,
            replied_to: null,
          },
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        console.log("this is something");
        setNewMessage("");

        if (res?.data?.success) {
          setMessages([...messages, res?.data?.content]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentMessages = async () => {
    try {
      // console.log("atleast api is calling",selectedChat.id)
      const ur = `http://localhost:3001/api/chats/messages/${selectedChat?.chat_id}`;
      console.log(ur);
      const res = await axios.get(
        `http://localhost:3001/api/chats/messages/${selectedChat?.chat_id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      // socket.emit('join_chat',selectedChat?.id);
      console.log(messages);
      if (res.data.success) {
        setMessages([...res?.data?.messages]);
          console.log(res?.data?.messages);
      } 
      console.log(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      getCurrentMessages();
    }, 1500);

    return () => {
      clearTimeout(identifier);
    };
  });

  const handleSelectedMessageOnMessageList = (message) => {
    //
    setSelectedMessageOnMessageList(message);
  };

  const handleDeleteMessageOnMessageList = (messageComp) => {
    //Here call the api for deleting the message
    console.log("Here reached");
    const filteredItems = messages.filter(
      (message) => message.id !== messageComp.id
    );
    setMessages(filteredItems);
  };

  const navigate = useNavigate();
  const navig = (username) => {
    console.log(username,"this is name for overlay");
    navigate(`/OtherProfile/${username}`);
  };

  return (
    <div className="flex flex-col justify-between h-full overflow-y-auto hide-scrollbar">
      <div className="h-fit bg-slate-100 w-full flex items-center">
        {/* Changes Required */}
        {
          // Info Overlay Required Currently
          infoOverlay && selectedChat?.is_group && (
            <ChatInfoOverlay
              closeFunction={() => {
                setInfoOverlay(false);
              }}
              group_name={selectedChat?.userName}
              user_ids={group_info}
            />
          )
        }

        {selectedChat && (
          <div className="sticky flex flex-row w-full items-center mx-4">
            <p className="flex-1 font-semibold text-xl">
              {selectedChat?.chat_name}
            </p>

            <img
              src={info}
              alt="info button"
              onClick={() => {
                if(!infoOverlay && !selectedChat.is_group){
                  navig(selectedChat.userName);
                } else setInfoOverlay(false);
                if (!infoOverlay && selectedChat.is_group){
                  setInfoOverlay(true);
                } else setInfoOverlay(false);
              }}
              className="h-10 w-10 cursor-pointer hover:scale-90"
            />
          </div>
        )}

      </div>
      <div className="h-10/12 p-6">
        <div
          id="listing-body"
          className="h-full overflow-auto hide-scrollbar  list_bottom"
        >
          {messages &&
            messages?.map((message) => (
              <div
                className={`${
                  message.user_id !== auth.user.id
                    ? "mr-32 ml-0 w-fit flex flex-col justify-start mb-2"
                    : " flex flex-col ml-32 mr-0 w-auto justify-end items-end mb-2 "
                }`}
              >
                {SelectedMessageOnMessageList?.id === message.id && (
                  <div className="h-fit border-x-2 border-t-2 border-b-0 text-sm bg-slate-100 px-8 py-2">
                    {SelectedMessageOnMessageList?.content}
                  </div>
                )}
                <ChatMessage
                  messageComponent={message}
                  handleSelectedMessageOnMessageList={() =>
                    handleSelectedMessageOnMessageList(message)
                  }
                  handleDeleteMessageFromMessageList={() =>
                    handleDeleteMessageOnMessageList(message)
                  }
                />
              </div>
            ))}
        </div>
      </div>
      <div className="h-fit bg-white items-top justify-center items-center border-gray-200 rounded-lg border-2 mx-2 mb-1 flex flex-col">
        {SelectedMessageOnMessageList && (
          <div className="flex flex-row items-center">
            <p className="flex-1 w-full h-fit bg-slate-100 p-2">
              {SelectedMessageOnMessageList.content}
            </p>
            <button
              className="bg-blue-500 text-white px-3 py-1 m-2 rounded-full"
              onClick={() => {
                setSelectedMessageOnMessageList(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex flex-row justify-center w-full items-center">
          <input
            onKeyDown={sendMessage}
            value={newMessage}
            onChange={handler}
            className="h-14 bg-white flex-1 ml-3 mt-2 mb-2 p-3 text-lg rounded-full border-2 border-gray-300 hover:border-blue-500 focus:border-black"
            placeholder="Write your message here!!!"
          />
          <button
            onClick={sendMessage}
            className="flex flex-row items-center bg-blue-600 h-4/6 space-x-2 px-2 mx-2 border-2 border-black rounded-full"
          >
            <p className="text-white">Send</p>
            <img src={Send} alt="send logo" className="h-12 w-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageList;
