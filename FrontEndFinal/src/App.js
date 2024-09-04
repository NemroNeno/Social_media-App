import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Hompage from "./pages/Hompage";
import chatPage from "./pages/chatPage";
import Email from "./pages/Email";
import MainChatsPage from "./pages/MainChatsPage";
import HomePost from './pages/HomePost';
import Profile from "./pages/Profile";
import OthersProfile from './pages/OthersProfile';
import UploadPicture from "./pages/UploadPicture";
import ForgetPassword from "./pages/ForgetPassword";

function App() {
  return (
    <div className="w-full h-full">
      <Routes>
      <Route path="/" element={<Hompage />} />
        <Route path='/homePost' element={<HomePost />} />
        <Route path="/chat" element={<chatPage />} />
        <Route path="/email" element={<Email />} />
        <Route path="/chatApp" element={<MainChatsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/OtherProfile/:username" element={<OthersProfile />} />
        <Route path="/picUpload" element={<UploadPicture />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
