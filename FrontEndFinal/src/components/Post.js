import React, { useState } from "react";
import ChahatFateh from "../img/Chahat.png";
import Like from "../img/Love.png";
import Liked from "../img/Favorite.png";
import Comment from "../img/Topic.png";
import { useAuth } from "./contexts/authContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Post = ({
  postObject,
  CommentsDescriptionHandler,
  PostRelevanceHandler,
}) => {
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
  const [postLike, setpostLike] = useState(
    postObject.if_liked == 1 ? true : false
  );
  const [likesOnPost, setLikesOnPost] = useState(parseInt(postObject.likes_count));
  const params=useParams();
  const navigate=useNavigate();
  const postToggler = async () => {
    try {
      if (!postLike) {
        console.log("calling for like");
        const res = await axios.post(
          `http://localhost:3001/api/posts/p/${postObject.id}/like`,
          { user: auth.user },
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );

        if (res.data.success) {
          console.log("liked");
          setpostLike(true);
          setLikesOnPost(likesOnPost+1);
        }
      } else {
        console.log("calling for dislike");
        const res = await axios.delete(
          `http://localhost:3001/api/posts/p/${postObject.id}/like`,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );

        if (res.data.success) {
          console.log("disliked");
          setpostLike(false);
          setLikesOnPost(likesOnPost - 1);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMainDivClick = () => {
    PostRelevanceHandler(postObject);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    CommentsDescriptionHandler(postObject);
  };

  // const colors = [
  //   'bg-red-100',
  //   'bg-blue-100',
  //   'bg-green-100',
  //   'bg-yellow-100',
  //   'bg-indigo-100',
  //   'bg-purple-100',
  //   'bg-red-100',
  //   'bg-blue-100',
  //   'bg-green-100',
  //   'bg-yellow-100',
  //   'bg-indigo-100',
  //   'bg-purple-100',
  //   'bg-red-100',
  //   'bg-blue-100',
  //   'bg-green-100',
  //   'bg-yellow-100',
  //   'bg-indigo-100',
  //   'bg-purple-100',
  //   // Add more Tailwind color classes as needed
  // ];

  // // Function to generate a random color from the array
  // const getRandomColor = () => {
  //   const randomIndex = Math.floor(Math.random() * colors.length);
  //   return colors[randomIndex];
  // };

  // // Get a random color class
  // const randomColorClass = getRandomColor();

  // {
  //   postId: "",
  //   body: "",
  //   repliedTo: "",
  //   user_id: "",
  //   privacy: "",
  //   created_at: "",
  // }

  return (
    // <div className={`grid-item cursor-pointer w-full h-fit ${randomColorClass} flex flex-col p-8 drop-shadow-sm hover:drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] transition duration-500 rounded-xl mb-2`}>
    <div
      onClick={handleMainDivClick}
      className="grid-item cursor-pointer border-2 border-black w-full h-fit bg-white flex flex-col p-8 drop-shadow-sm hover:drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] transition-all duration-500 rounded-xl mb-2"
    >
      {/* Image and Username and Posting Date */}
      <div className="flex flex-row justify-start items-center">
        <img
          src={postObject?.image_url?postObject?.image_url:ChahatFateh}
          alt="chahat fateh ali khan"
          className="h-8 w-8 mr-3 shadow-lg transform hover:shadow-2xl transition duration-300 rounded-full"
        />
        <div className="flex flex-col">
          <p className="font-bold hover:text-blue-500" onClick={(e)=>{
            e.stopPropagation();
            navigate(`/OtherProfile/${postObject.username}`)}}>@{postObject.username}</p>
          <p className="font-thin">{postObject.created_at.substring(0, 10)}</p>
        </div>
      </div>
      {/* PostContent */}
      <div className="w-full tracking-wide line-clamp-none flex items-center justify-center mt-5 mb-5 overflow-x-auto">
        {postObject.body}
      </div>
      {/* Like and CommentButton */}
      <div className="flex flex-row w-full justify-center items-center mt-5 mb-3 space-x-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            postToggler();
          }}
          className="flex flex-row rounded px-5 py-3 text-sm font-medium text-black-600 transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-black-500 space-x-1"
        >
          <img
            src={postLike ? Liked : Like}
            alt="postLike"
            className="h-5 w-5"
          />
          <p>like</p>
          <p className="font-extrabold pr-4">{likesOnPost}</p>
        </div>
        <div
          onClick={(e) => handleCommentClick(e)}
          className="w-fit flex flex-row rounded px-4 py-3 text-sm font-medium text-black-600 transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-black-500 space-x-1"
        >
          <img src={Comment} alt="Comment on post" className="h-5 w-5" />
          <p>Comment</p>
          <p className="font-extrabold pr-4">{postObject.reply_count}</p>
        </div>
      </div>
      <hr className="border-gray border-b-2"></hr>
    </div>
  );
};

export default Post;
