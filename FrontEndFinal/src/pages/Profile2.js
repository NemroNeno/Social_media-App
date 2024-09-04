import React, { useState } from "react";
import Chahat from "../img/vector.png";
import "../pages/styles.css";
import OverlayWrapper from "../components/OverlayWrapper";
import SearchUi from "../components/SearchUi";
import Post from "../components/Post";
import "./styles.css";
import Masonry from "react-masonry-css";
import CommentListComponent from "../components/Comment";

const Profile = () => {
  const breakpointColumnsObj = {
    default: 2,
  };

  const [postsNonCommentList, setPostsNonCommentList] = useState([
    {
      postId: "1",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      repliedTo: "",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      postId: "2",
      body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      repliedTo: "",
      user_id: "user456",
      privacy: "private",
      created_at: "2023-12-23T10:30:00Z",
    },
    {
      postId: "3",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      repliedTo: "",
      user_id: "user789",
      privacy: "public",
      created_at: "2023-12-22T15:45:00Z",
    },
    {
      postId: "4",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      repliedTo: "",
      user_id: "user101",
      privacy: "private",
      created_at: "2023-12-21T12:20:00Z",
    },
    {
      postId: "5",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      repliedTo: "",
      user_id: "user202",
      privacy: "public",
      created_at: "2023-12-20T17:00:00Z",
    },
    {
      postId: "10",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      repliedTo: "",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      postId: "2",
      body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      repliedTo: "",
      user_id: "user456",
      privacy: "private",
      created_at: "2023-12-23T10:30:00Z",
    },
    {
      postId: "3",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      repliedTo: "",
      user_id: "user789",
      privacy: "public",
      created_at: "2023-12-22T15:45:00Z",
    },
    {
      postId: "4",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      repliedTo: "",
      user_id: "user101",
      privacy: "private",
      created_at: "2023-12-21T12:20:00Z",
    },
    {
      postId: "5",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      repliedTo: "",
      user_id: "user202",
      privacy: "public",
      created_at: "2023-12-20T17:00:00Z",
    },
    {
      postId: "100",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      repliedTo: "",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      postId: "2",
      body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      repliedTo: "",
      user_id: "user456",
      privacy: "private",
      created_at: "2023-12-23T10:30:00Z",
    },
    {
      postId: "3",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      repliedTo: "",
      user_id: "user789",
      privacy: "public",
      created_at: "2023-12-22T15:45:00Z",
    },
    {
      postId: "4",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      repliedTo: "",
      user_id: "user101",
      privacy: "private",
      created_at: "2023-12-21T12:20:00Z",
    },
    {
      postId: "5",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      repliedTo: "",
      user_id: "user202",
      privacy: "public",
      created_at: "2023-12-20T17:00:00Z",
    },
  ]);

  const skills = [
    "ReactDeveloper",
    "Singer",
    "Entertainer",
    "Pilot",
    "Engineering",
  ];

  const blocked = [
    { name: "Samantha Rodriguez" },
    { name: "Marcus Thompson" },
    { name: "Olivia Patel" },
    { name: "Elijah Nguyen" },
    { name: "Isabella Chang" },
    { name: "Caleb Mitchell" },
    { name: "Sophia Khan" },
    { name: "Aiden Sullivan" },
    { name: "Ava Gupta" },
    { name: "Jackson Kim" },
  ];

  const followers = [
    { name: "Emily Johnson" },
    { name: "Noah Williams" },
    { name: "Mia Brown" },
    { name: "Liam Jones" },
    { name: "Emma Garcia" },
    { name: "Jacob Martinez" },
    { name: "Avery Wilson" },
    { name: "William Anderson" },
    { name: "Sophia Lopez" },
    { name: "Alexander Lee" },
  ];

  const following = [
    { name: "Madison Moore" },
    { name: "Ethan Davis" },
    { name: "Chloe Jackson" },
    { name: "Mason White" },
    { name: "Grace Harris" },
    { name: "Logan Taylor" },
    { name: "Ella Thomas" },
    { name: "James Clark" },
    { name: "Aria Robinson" },
    { name: "Daniel Lewis" },
  ];

  const [postsCommentList, setPostsCommentList] = useState([
    {
      postId: "6",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      repliedTo: "1",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      postId: "7",
      body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      repliedTo: "1",
      user_id: "user456",
      privacy: "private",
      created_at: "2023-12-23T10:30:00Z",
    },
    {
      postId: "8",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      repliedTo: "1",
      user_id: "user789",
      privacy: "public",
      created_at: "2023-12-22T15:45:00Z",
    },
    {
      postId: "9",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      repliedTo: "1",
      user_id: "user101",
      privacy: "private",
      created_at: "2023-12-21T12:20:00Z",
    },
    {
      postId: "10",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      repliedTo: "1",
      user_id: "user202",
      privacy: "public",
      created_at: "2023-12-20T17:00:00Z",
    },
    {
      postId: "6",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      repliedTo: "1",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      postId: "7",
      body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      repliedTo: "1",
      user_id: "user456",
      privacy: "private",
      created_at: "2023-12-23T10:30:00Z",
    },
    {
      postId: "8",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      repliedTo: "1",
      user_id: "user789",
      privacy: "public",
      created_at: "2023-12-22T15:45:00Z",
    },
    {
      postId: "9",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      repliedTo: "1",
      user_id: "user101",
      privacy: "private",
      created_at: "2023-12-21T12:20:00Z",
    },
    {
      postId: "10",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      repliedTo: "1",
      user_id: "user202",
      privacy: "public",
      created_at: "2023-12-20T17:00:00Z",
    },
    {
      postId: "6",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      repliedTo: "1",
      user_id: "user123",
      privacy: "public",
      created_at: "2023-12-24T08:00:00Z",
    },
    {
      postId: "7",
      body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      repliedTo: "1",
      user_id: "user456",
      privacy: "private",
      created_at: "2023-12-23T10:30:00Z",
    },
    {
      postId: "8",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      repliedTo: "1",
      user_id: "user789",
      privacy: "public",
      created_at: "2023-12-22T15:45:00Z",
    },
    {
      postId: "9",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      repliedTo: "1",
      user_id: "user101",
      privacy: "private",
      created_at: "2023-12-21T12:20:00Z",
    },
    {
      postId: "10",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      repliedTo: "1",
      user_id: "user202",
      privacy: "public",
      created_at: "2023-12-20T17:00:00Z",
    },
  ]);

  const [selectedForCommentPost, setSelectedForCommentPost] = useState();

  const commentHandler = (postObject) => {
    if (selectedForCommentPost) {
      setSelectedForCommentPost(null);
    } else {
      setSelectedForCommentPost(postObject);

      //API call for extracting comments of a specific post
      const filteredItems = extractComments(postObject.postId);
      console.log(filteredItems);
      setCommentsList(filteredItems);
    }
  };
  const extractComments = (postId) => {
    return postsCommentList.filter((post) => post.repliedTo === postId);
  };

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

  const [followersOverlay, setFollowersOverlay] = useState(false);
  const [followingOverlay, setFollowingOverlay] = useState(false);
  const [blockOverlay, setBlockOverlay] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gray-50 sm:grid sm:grid-cols-2">
        <div class="p-8 md:p-12 lg:px-16 bg-slate-100 justify-center items-center flex">
          <div class="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            {/* Main Name */}
            <p class="text-6xl font-bold text-gray-900 md:text-5xl m-5">
              Nemro neno
            </p>

            {/* Username */}
            <h2 class="text-4xl font-bold text-gray-900 md:text-3xl mb-4">
              @Nemro
            </h2>

            {/* Description */}
            <p className="hidden text-gray-500 md:mt-4 md:block mb-4">
              Passionate Singer, Exclusively broadcasted himself for a song
              presented to PSL fans
            </p>

            {/* Skills tags */}
            <p className="text-2xl font-bold mb-4">Skills</p>
            <div className="flex flex-wrap items-center justify-center">
              {skills.map((skill, index) => (
                <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700 m-2">
                  <p className="whitespace-nowrap text-sm">#{skill}</p>
                </span>
              ))}
            </div>
            <div className="flex flex-row items-center justify-center gap-3">
              <div
                class="mt-4 md:mt-8 inline-block rounded bg-emerald-600 px-12 py-3 text-lg font-medium text-white transition hover:bg-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 cursor-pointer"
                onClick={() => {
                  const nextDiv = document.getElementById("targetDiv");
                  if (nextDiv) {
                    nextDiv.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <p>Get Started</p>
              </div>
              <div class="mt-4 md:mt-8 inline-block rounded bg-teal-600 px-12 py-3 text-lg font-medium text-white transition hover:bg-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400">
                <p>Edit Profile</p>
              </div>
            </div>
          </div>
        </div>
        <img
          alt="Student"
          src={Chahat}
          class="h-56 w-full object-cover sm:h-full transition-transform duration-200 transform hover:scale-105 top-0 left-0 hide-scrollbar"
        />
      </div>

      {/* Next section having followers and following and blocked */}
      <div
        id="targetDiv"
        className="flex-1 flex-col h-screen justify-center items-center mt-28"
      >
        <section class="bg-white">
          <div class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
              <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                "Connecting People, Enriching Lives – One Interaction at a
                Time."
              </h2>

              <p class="mt-4 text-gray-500 sm:text-xl">
                Empowering Connections: Followers, Following, and Beyond.
              </p>
            </div>

            <div class="mt-8 sm:mt-12">
              <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Followers */}
                <div
                  onClick={() => {
                    if (!followersOverlay) {
                      setFollowersOverlay(true);
                    } else {
                      setFollowersOverlay(false);
                    }
                    setFollowingOverlay(false);
                    setBlockOverlay(false);
                  }}
                  class="flex flex-col rounded-lg border border-gray-900 px-4 py-8 text-center hover:bg-yellow-300"
                >
                  <dt class="order-last text-lg font-medium text-gray-500">
                    Followers
                  </dt>

                  <dd class="text-4xl font-extrabold text-green-600 md:text-5xl">
                    260
                  </dd>
                </div>
                {followersOverlay && !followingOverlay && !blockOverlay && (
                  <OverlayWrapper
                    closeFunction={() => {
                      setFollowersOverlay(false);
                    }}
                  >
                    <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
                      <p className="text-5xl flex justify-center mb-7 font-extrabold">
                        Followers
                      </p>
                      <SearchUi searchString="Follower ...." />
                      {followers.map((follower) => (
                        <p className="h-20 w-full items-center justify-center flex text-lg border-2 border-black mb-2 hover:bg-yellow-300">
                          {follower.name}
                        </p>
                      ))}
                    </div>
                  </OverlayWrapper>
                )}

                {/* Following */}
                <div
                  onClick={() => {
                    if (!followingOverlay) {
                      setFollowingOverlay(true);
                    } else {
                      setFollowingOverlay(false);
                    }
                    setFollowersOverlay(false);
                    setBlockOverlay(false);
                  }}
                  class="flex flex-col rounded-lg border border-gray-900 px-4 py-8 text-center hover:bg-yellow-300"
                >
                  <dt class="order-last text-lg font-medium text-gray-500">
                    Following
                  </dt>

                  <dd class="text-4xl font-extrabold text-blue-600 md:text-5xl">
                    1
                  </dd>
                </div>
                {!followersOverlay && followingOverlay && !blockOverlay && (
                  <OverlayWrapper
                    closeFunction={() => {
                      setFollowingOverlay(false);
                    }}
                  >
                    <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
                      <p className="text-5xl flex justify-center mb-7 font-extrabold">
                        Following
                      </p>
                      <SearchUi searchString="Following ...." />
                      {following.map((follower) => (
                        <p className="h-20 w-full items-center justify-center flex text-lg border-2 border-black mb-2 hover:bg-yellow-300">
                          {follower.name}
                        </p>
                      ))}
                    </div>
                  </OverlayWrapper>
                )}

                {/* Blocked */}
                <div
                  onClick={() => {
                    if (!blockOverlay) {
                      setBlockOverlay(true);
                    } else {
                      setBlockOverlay(false);
                    }
                    setFollowingOverlay(false);
                    setFollowersOverlay(false);
                  }}
                  class="flex flex-col rounded-lg border border-gray-900 px-4 py-8 text-center hover:bg-yellow-300"
                >
                  <dt class="order-last text-lg font-medium text-gray-500">
                    Blocked
                  </dt>

                  <dd class="text-4xl font-extrabold text-red-600 md:text-5xl">
                    107
                  </dd>
                </div>
                {!followersOverlay && !followingOverlay && blockOverlay && (
                  <OverlayWrapper
                    closeFunction={() => {
                      setBlockOverlay(false);
                    }}
                  >
                    <div className="w-full h-fit p-3 border-2 border-black bg-blue-100">
                      <p className="text-5xl flex justify-center mb-7 font-extrabold">
                        Blocked
                      </p>
                      <SearchUi searchString="Blocked ...." />
                      {blocked.map((block) => (
                        <p className="h-20 w-full items-center justify-center flex text-lg border-2 border-black mb-2 hover:bg-yellow-300">
                          {block.name}
                        </p>
                      ))}
                    </div>
                  </OverlayWrapper>
                )}
              </dl>
            </div>
          </div>
        </section>
      </div>

      <div className="flex-1 flex-col h-screen w-screen mt-28">
        <p className="h-full w-full text-5xl font-semibold font-serif flex justify-center">
          POSTS UPLOADED
        </p>
        {!selectedForCommentPost && (
          <div className="w-screen h-screen bg-slate-100 overflow-y-auto hide-scrollbar p-2">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="masonary-grid flex flex-row overflow-y-auto hide-scrollbar gap-2"
              columnClassName="masonary-grid_column"
            >
              {postsNonCommentList?.map((post, index) => (
                <Post
                  postObject={post}
                  CommentsDescriptionHandler={() => commentHandler(post)}
                  PostRelevanceHandler={() => {}}
                />
              ))}
            </Masonry>
          </div>
        )}
        {/* When comments for a post are shown */}
        {selectedForCommentPost && (
          <div className="w-screen h-screen bg-slate-100 overflow-y-auto hide-scrollbar p-2">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="masonary-grid flex flex-row overflow-y-auto hide-scrollbar gap-4 transition-all duration-300"
              columnClassName="masonary-grid_column"
            >
              {postsNonCommentList?.map((post, index) =>
                selectedForCommentPost.postId !== post.postId ? (
                  <Post
                    postObject={post}
                    CommentsDescriptionHandler={commentHandler}
                    PostRelevanceHandler={() => {}}
                  />
                ) : (
                  <div className="w-fit h-fit flex flex-col bg-green-200 border-green-300 border-4 rounded-xl p-px my-10 transition-all duration-1000">
                    <Post
                      postObject={post}
                      CommentsDescriptionHandler={commentHandler}
                      PostRelevanceHandler={() => {}}
                    />
                    <label
                      for="Username"
                      class="mt-3 mx-1 relative block rounded-full border border-gray-200 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black bg-green-400 text-white"
                    >
                      <input
                        type="text"
                        id="Username"
                        className="peer border-none bg-transparent placeholder-green-900 focus:border-black focus:outline-none focus:ring-0 p-1 m-1"
                        placeholder="Comment"
                      />
                    </label>
                    <div>
                      {commentsList?.map((commentedPost) => (
                        <CommentListComponent commentedPost={commentedPost} />
                      ))}
                    </div>
                  </div>
                )
              )}
            </Masonry>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
