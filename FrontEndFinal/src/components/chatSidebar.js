import axios from 'axios';
import React from 'react'
import { useAuth } from './contexts/authContext';
import Chahat from "../img/Chahat.png";

const ChatSidebar = ({user}) => {
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
    setMessages
  ]=useAuth();


  return (
    <div className='w-full h-20 bg-white  p-2 flex flex-row shadow-lg mb-px  hover:bg-blue-200 focus:!bg-green-300 transition-all duration-300 cursor-pointer items-center'>
      <div className='pl-1.5 pr-1.5'><img src={user?.image_url?  user?.image_url  :  Chahat} alt='Chahat Fateh Ali Khan' className='rounded-full h-12 w-12 border-black border-2'/></div>
        <p className='font-bold focus:font-thin'>{user.chat_name}</p>
    </div>
  )
}

export default ChatSidebar
