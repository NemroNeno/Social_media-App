import React, { useState, useEffect } from "react";
import TopBarApp from "../components/TopBarApp";
import Post from "../components/Post";
import "./styles.css";
import Masonry from "react-masonry-css";
import CommentListComponent from "../components/Comment";
import Add from "../img/Library add.png";
import OverlayWrapper from "../components/OverlayWrapper";
import { useAuth } from "../components/contexts/authContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import Chahat from "../img/Checked User Male.png"

const HomePost = () => {
 
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

  // All state managements placed here
  //We shall tackle all state management using this for representations of
  const [selectedForCommentPost, setSelectedForCommentPost] = useState();
  const [selectedForRelevancePost, setSelectedForRelevancePost] = useState();
  const [NewPostData, setNewPostData] = useState("");
  const NewPostHandler = (e) => {
    setNewPostData(e.target.value);
  };
  const [commentData, setCommentData] = useState("");

  const [commentsList, setCommentsList] = useState([
    {
      postId: "",
      body: "",
      repliedTo: "",
      user_id: "",
      privacy: "",
      created_at: "",
    },
  ]);

  const [postRelevanceList, setPostRelevanceList] = useState([
    {
      postId: "",
      body: "",
      repliedTo: "",
      user_id: "",
      privacy: "",
      created_at: "",
    },
  ]);

  const [postInput, setPostInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const commentDataHandler = (e) => {
    setCommentData(e.target.value);
    console.log(commentData);
  };

  const commentMake = async (event, postId) => {
    if (!commentData) return;
    if (event.key !== "Enter") 
    return;
    {
      try {
        const res = await axios.post(
          "http://localhost:3001/api/posts/create",
          {
            body: commentData,
            replied_to: postId,
            privacy: false,
          },
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );

        if (res.data.success) {
          console.log(res.data);
          setCommentData("");
          alert("Successfully commented on Post");
        } else {
          alert("post creation error");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  //Main posts database

  //Main non comments posts database already from backend
  const [postsNonCommentList, setPostsNonCommentList] = useState();

  //All comments based post
  const arr = [
    {
      id: "60",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      replied_to: "5",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      id: "60",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      replied_to: "5",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      id: "60",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      replied_to: "5",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
  ];
  const [postsCommentList, setPostsCommentList] = useState([
    {
      id: "60",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      replied_to: "5",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      id: "60",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      replied_to: "5",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      id: "60",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      replied_to: "5",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
  ]);

  // const extractComments = (post_id) => {
  //   return arr.filter((post) => post.replied_to === post_id);
  // };
  const extractRelevantPosts = (postId) => {
    return postsCommentList.filter((post) => post.repliedTo === postId);
  };

  const handleSelector = (e) => {
    setSelectedOption(e.target.value); // Get the value of the selected option
  };
  const handlePostInput = () => {
    if (postInput) {
      setPostInput(false);
    } else {
      setPostInput(true);
    }
  };
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
  };
  const commentHandler = async (postObject) => {
    try {
      if (selectedForCommentPost) {
        if (selectedForCommentPost.id === postObject.id) {
          setSelectedForCommentPost(null);
          setSelectedForRelevancePost(null);
          return;
        }
        // api call
        setSelectedForCommentPost(postObject);
        console.log(postObject.id, " This is mvs");
        const res = await axios.post(
          "http://localhost:3001/api/posts/c/getComments",
          { post_id: postObject.id }
        );
        console.log(res.data.post);
        if (res.data.success) {
          setCommentsList([...res.data.comments]);
          setSelectedForRelevancePost(null);
        }
      } else {
        setSelectedForCommentPost(postObject);
        console.log(postObject.id, " This is mvs");
        const res = await axios.post(
          "http://localhost:3001/api/posts/c/getComments",
          { post_id: postObject.id }
        );
        console.log(res.data.post);
        if (res.data.success) {
          setCommentsList([...res.data.comments]);
          setSelectedForRelevancePost(null);
        }
        setPostRelevanceList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const postRelevanceHandler = (postObject) => {
    setSelectedForCommentPost(null);
    setSelectedForRelevancePost(postObject);

    //API call for extracting relevant posts of a specific post
    setCommentsList([]);
    // setPostRelevanceList(filteredItems);
  };

  useEffect(() => {
    console.log(allPosts);
  }, [allPosts]);

  const handleCreatePost = async (e) => {
    try {
      e.preventDefault();
      // console.log(auth.token);

      // e.preventDefault();
      const res = await axios.post(
        "http://localhost:3001/api/posts/create",
        {
          body: NewPostData,
          replied_to: null,
          privacy: false,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (res.data.success) {
        console.log(res.data);
        alert("New post Created and published");
        setPostInput(false);
      } else {
        alert("post creation error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [image, setImage] = useState("");
  const handlePicUpload = () =>{

  }

  return (
    <TopBarApp isChats={false} isPosts={true}>
      <div className="h-screen w-screen flex flex-col !bg-slate-100">
        {/* TopBarOfPOsts */}
        <div className="h-16 bg-slate-100 w-screen sticky ml-5 items-center flex z-10">
          <div className="bg-gray-200 flex flex-row w-4/12 p-2 rounded-full">
            {/* SearchComponent */}
            <div class="relative w-7/12 mr-3">
              <label for="Search" class="sr-only">
                {" "}
                Search{" "}
              </label>

              <input
                type="text"
                id="Search"
                placeholder="Search for Posts"
                className=" w-full rounded-full border-gray-200 p-3 pr-8 shadow-sm sm:text-sm"
              />

              <span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
                <button type="button" class="text-gray-600 hover:text-gray-700">
                  <span class="sr-only">Search</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </span>
            </div>

            {/* DropDownMenu */}
            <div className="relative w-5/12 mr-3">
              <select
                onChange={handleSelector}
                className="w-full p-2.5 text-gray-500 bg-white border shadow-sm outline-none appearance-none hover:scale-90 hover:border-indigo-400 focus:border-indigo-600"
              >
                <option>Name</option>
                <option>Hash</option>
                <option>Trending</option>
              </select>
            </div>
          </div>
          {/*Adding post button*/}
          <div className="ml-3 border-black border-2 flex flex-row justify-center items-center rounded-full p-1">
            <button
              className="inline-block rounded-full border border-black p-3 text-indigo-600 hover:bg-yellow-400 hover:text-white focus:outline-none focus:ring active:bg-indigo-500 "
              onClick={handlePostInput}
            >
              <img src={Add} className="h-5 w-5" alt="Add button" />
            </button>
            <p className="text-bold ml-2">Add Post Here</p>
          </div>
        </div>
        {/*                   Adding post to post grid in here */}
        {postInput && (
          <OverlayWrapper closeFunction={() => setPostInput(false)}>

              <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
                      <p className="text-5xl flex justify-center mb-7 font-extrabold">
                        Add a new Post
                      </p>
  

              <span class="flex items-center">
                <span class="h-px flex-1 bg-black w-full" />
              </span>

              <form action="" class="mx-auto mb-0 mt-8 w-80 space-y-4">
                <div class="relative">
                  <textarea
                    onChange={NewPostHandler}
                    rows={5}
                    type="text"
                    value={NewPostData}
                    class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm hover:scale-110 focus:scale-110 transition-all duration-300 mb-5"
                    placeholder="Enter Content of post"
                  />
                </div>

                <input
          type="file"
          name="photo"
          accept="image/*"
          className=""
          onChange={(e) => {
          setImage(e.target.files[0]);
          }}
        />

        {true && (
          <div className="text-center">
            <img
              src={Chahat}
              alt="Product photo"
              height={"50px"}
              className="img img-responsive border-2 border-black h-48 w-48"
            />
          </div>
        )}

                <button
                  class="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring"
                  href="/download"
                  onClick={handleCreatePost}
                >
                  <span class="absolute inset-y-0 left-0 w-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full group-active:bg-indigo-500"></span>

                  <span class="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
                    Add Post
                  </span>
                </button>
              </form>
              </div>

          </OverlayWrapper>
        )}

        {/*Posts Area*/}
        {/* Conditional Rendering */}
        {/* When nothing to be shown */}
        {!selectedForCommentPost && !selectedForRelevancePost && (
          <div className="w-screen h-screen bg-slate-100 overflow-y-auto hide-scrollbar p-2">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="masonary-grid flex flex-row overflow-y-auto hide-scrollbar gap-2"
              columnClassName="masonary-grid_column"
            >
              {allPosts?.map((post, index) => (
                <Post
                  postObject={post}
                  CommentsDescriptionHandler={commentHandler}
                  PostRelevanceHandler={postRelevanceHandler}
                />
              ))}
            </Masonry>
          </div>
        )}
        {/* When comments for a post are shown */}
        {selectedForCommentPost && !selectedForRelevancePost && (
          <div className="w-screen h-screen bg-slate-100 overflow-y-auto hide-scrollbar p-2">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="masonary-grid flex flex-row overflow-y-auto hide-scrollbar gap-4 transition-all duration-300"
              columnClassName="masonary-grid_column"
            >
              {allPosts?.map((post, index) =>
                selectedForCommentPost.id !== post.id ? (
                  <Post
                    postObject={post}
                    CommentsDescriptionHandler={commentHandler}
                    PostRelevanceHandler={postRelevanceHandler}
                  />
                ) : (
                  <div className="w-fit h-fit flex flex-col bg-green-200 border-green-300 border-4 rounded-xl p-px my-10 transition-all duration-1000">
                    <Post
                      postObject={post}
                      CommentsDescriptionHandler={commentHandler}
                      PostRelevanceHandler={postRelevanceHandler}
                    />
                    <label
                      for="Username"
                      class="mt-3 mx-1 relative block rounded-full border border-gray-200 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black bg-green-600"
                    >
                      <input
                        value={commentData}
                        onChange={commentDataHandler}
                        onKeyDown={(event) => commentMake(event, post.id)}
                        type="text"
                        id="Username"
                        className="peer border-none bg-transparent placeholder-green-900 focus:border-black focus:outline-none focus:ring-0 p-1 m-1"
                        placeholder="Comment"
                      />
                    </label>
                    <div>
                      {commentsList?.map((commentedPost, index2) => (
                        <CommentListComponent commentedPost={commentedPost} />
                      ))}
                    </div>
                  </div>
                )
              )}
            </Masonry>
          </div>
        )}
        {/* When posts relevance are shown */}
        {selectedForRelevancePost && !selectedForCommentPost && (
          <div className="w-screen h-screen bg-slate-100 overflow-y-auto hide-scrollbar p-2 flex flex-row">
            {/* RelevanceListDisplay */}
            <div className="w-2/5 h-screen border-black border-y-6 border-r-6 flex flex-col overflow-y-auto hide-scrollbar p-4">
              {
                <button
                  onClick={() => {
                    setSelectedForCommentPost();
                    setSelectedForRelevancePost();
                  }}
                  className="inline-block w-full h-10 rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
                >
                  Close
                </button>
              }
              {<p className="font-bold text-3xl mx-4 my-2 font-serif">Following are the available same referencial posts</p>}
              {postRelevanceList?.map((post, index) => (
                <Post
                  postObject={post}
                  CommentsDescriptionHandler={commentHandler}
                  PostRelevanceHandler={postRelevanceHandler}
                />
              ))}
            </div>
            {/* NonCommentPostListDisplay */}
            <div className="w-3/5 h-screen bg-slate-100 flex flex-col overflow-y-auto hide-scrollbar p-2">
              {allPosts?.map((post, index) => (
                <Post
                  postObject={post}
                  CommentsDescriptionHandler={commentHandler}
                  PostRelevanceHandler={postRelevanceHandler}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </TopBarApp>
  );
};

export default HomePost;
