import react, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const nav = useNavigate();
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });

  const [selectedChat, setSelectedChat] = useState();
  const [UserChats, setUserChats] = useState([]);
  const [chat, setChat] = useState([]);
  const [allPosts, setAllPost] = useState([]);
  const [currentSelectedPost, setCurrentSelectedPost] = useState();
  const [CurrentCommentPost, setCurrentCommentPost] = useState();
  const [messages, setMessages] = useState([]);
  const [group_info,setGroupInfo]=useState([]);

  const getPosts= async  (token)=>{
    try {
      if(token){
        console.log(auth.user);
        console.log('token being sent before the post',token);
        const res= await axios.post('http://localhost:3001/api/posts/p/1',
        { user:auth.user },
          {
            headers: {
              Authorization: token
            },
          })
          if(res.data.success)
           setAllPost([...res.data.posts])
      }



    } catch (error) {
      console.log(error);
    }
  }
  const getUserChats = async (token) => {
    if(!auth.token){
      return;
    }
    try {
      if (token) {
        console.log(auth);
        const res = await axios.post(
          "http://localhost:3001/api/chats/getUserChats",
          { user_id: auth?.user?.id },
          {
            headers: {
              Authorization: token
            },
          }
        );

        setUserChats([...res?.data?.chats]);
      }
    
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("db_user");
    if (data) {
      const parsed = JSON.parse(data);
      setAuth({
        ...auth,
        user: parsed.user,
        token: parsed.token,
      });
      console.log(parsed.token);
      //nav('/chatApp');
    }
    //elint-disable-next-line
  }, []);

  useEffect(() => {
    const getChat = async () => {
      if(auth){
         console.log('called the both api')
        await getUserChats(auth.token);
        await getPosts(auth.token);
      }

    };
    getChat();
    
  }, [auth]);

  return (
    <AuthContext.Provider
      value={[
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
        group_info,setGroupInfo
      ]}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
