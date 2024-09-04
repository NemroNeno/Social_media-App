import React from "react";
import { useAuth } from "./contexts/authContext";



const ChatMessage = ({ messageComponent, handleSelectedMessageOnMessageList, handleDeleteMessageFromMessageList }) => {

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
  ] = useAuth();
  return (
    <div
      className={`message-wrapper ${
        messageComponent.user_id === auth.user.id  ? "justify-end items-end" : "justify-start items-start"
      } hover:cursor-pointer mb-2`}
     onClick={(e)=>{e.stopPropagation()
      handleSelectedMessageOnMessageList()}}
     onDoubleClick={handleDeleteMessageFromMessageList}>
      <div
        className={`w-fit ${
          messageComponent.user_id !== auth.user.id ? "bg-black text-white" : "bg-white border-black border-2"
        } p-2 transition-all duration-500 rounded-2xl mb-px flex flex-col`}
      >
        {messageComponent.id !== auth.user.id ?<p className="font-medium mx-0">@{messageComponent.username}</p>:<></>}
        <p className=" w-full break-words whitespace-normal font-sans px-4">
          {messageComponent.content}
        </p>
      </div>



      {/* Changes Required */}
      <div><p className="font-light">{messageComponent.created_at.substring(11,19)}</p></div>
    </div>

    
    // <div
    //   className={`message-wrapper ${
    //     keyId === auth.user.id  ? "justify-end" : "justify-start"
    //   }`}
    // >
    //   <div
    //     className={`w-fit ${
    //       keyId !== auth.user.id ? "bg-green-300" : "bg-blue-300"
    //     } p-4 transition-all duration-500 rounded-full mb-4`}
    //   >
    //     <p className=" w-full break-words whitespace-normal font-mono">
    //       {dynamicString}
    //     </p>
    //   </div>
    // </div>
  );
};

export default ChatMessage;
