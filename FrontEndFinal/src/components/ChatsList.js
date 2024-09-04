import React, { useEffect, useState } from "react";
import ChatSidebar from "./chatSidebar";
import "./ChatsList.css";
import { useAuth } from "./contexts/authContext";
import axios from "axios";

const ChatsList = (props) => {
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
 

  useEffect(() => {
    //console.log('data is changing here')
    //console.log(UserChats);
  }, [UserChats]);

  const getCurrentMessages = async () => {
    try {
      // console.log("atleast api is calling",selectedChat.id)
      const ur = `http://localhost:3001/api/chats/messages/${selectedChat.chat_id}`;
      console.log(ur);
      const res = await axios.get(
        `http://localhost:3001/api/chats/messages/${selectedChat.chat_id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      // socket.emit('join_chat',selectedChat?.id);
      console.log("This is causing the problem 4");
      if (res.data.success) {
        setMessages([...res?.data?.messages]);
        //   console.log(res?.data?.messages);
      } else {
        setMessages([]);
      }
      console.log(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    setMessages([]);
    getCurrentMessages();
  }, [selectedChat]);

  useEffect(()=>{
         if(!selectedChat)
         return;
        if(!selectedChat.is_group)
        return;
      getCurrentGroupInfo(selectedChat?.chat_id);

  },[selectedChat])

  const getCurrentGroupInfo= async(chat_id)=>{
    try {
      
       const res= await axios.get(`http://localhost:3001/api/group/g/${chat_id}/members`)
       if( res.data.success){
        setGroupInfo([...res?.data?.members]);
        console.log(res.data.members);
       }
    } catch (error) {
      console.log(error);
    }
  }

  const getThisChatID = async (u) => {
    try {
      console.log(selectedChat);
      if (u.is_group) {
        setSelectedChat(u);
        console.log("clicko");
      }
      const res = await axios.post(
        `http://localhost:3001/api/chats/dm_with/u/${u.chat_name}`,
        { user1: auth.username },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      // console.log(res.data.chat_id.chat_id);

      setSelectedChat({
        chat_id: res?.data?.chat_id?.chat_id,
        userName: u.chat_name,
      });
      // console.log("this is selected chat_id",res.data.chat_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-y-auto hide-scrollbar h-screen items-start w-full">
      {UserChats?.length > 0 ? (
        UserChats?.map((c, index) => (
          <div
            key={c.id}
            onClick={() => getThisChatID(c)}
            className="transtion-all duration-300 w-full"
          >
            {" "}
            <ChatSidebar user={c} className="focus:bg-slate-500" />{" "}
          </div>
        ))
      ) : (
        <p className="font-bold text-center mt-60 mx-4">
          Search a user to start chatting from the search bar
        </p>
      )}
    </div>
  );
};

export default ChatsList;
