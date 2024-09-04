require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = require("express")();


const server = require("http").createServer(app);
const cors = require("cors");

app.use(cors());
app.use(morgan("dev"));

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    //methods: ["GET", "POST"],
    //  allowedHeaders: ["*"],
    credentials: true,
  },
});

//const app = express();
//const server = require('http').createServer();
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./src/database/db");

app.use(cookieParser());
app.use(express.json()); // for frontend_data -> json, to access req.body

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server listening on Port ${PORT}`);
}); // by default localhost

// Basic connection socket
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log("connected");
  });

  // Join chatRoom socket
  let ro;
  socket.on("join_room", (room) => {
    socket.join(room);
    ro = room;
    console.log("User has joined this chat room :", room);
  });
  let newdata;
  socket.on("newMessage", (newMessageRecieved) => {
    console.log(newMessageRecieved, " :to room 30 ");
    newdata = newMessageRecieved;
    // socket.join(newMessageRecieved.chat_id);
    socket.to(ro).emit("messageRecieved", newdata);
  });
});

app.use(express.static(path.join(__dirname, "/src/public")));

const userRouter = require("./src/routers/userRouter.js");
const postsRouter = require("./src/routers/postsRouter.js");
const authRouter = require("./src/routers/authRouter.js");
const { Socket } = require("socket.io");
const chatsRouter = require("./src/routers/chatsRouter.js");
const groupRouter = require("./src/routers/groupsRouter.js");
const {
  getUserByEmailOrUsername,
  getOtherUserOfChat,
  getAllChats,
  getIdFromChat,
} = require("./src/controller/methods.js");

app.use("/api/posts", postsRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/group", groupRouter);
