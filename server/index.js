const express = require("express");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const { log } = require("console");
// const  = require("")

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["POST, GET"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  socket.on("chat_message", (messageData) => {
    const id = messageData.socketId;
    console.log(messageData);
    // console.log(id);
    socket.broadcast.emit("send message", messageData);
    // io.to(id).emit("send message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server running on port 3000 ");
});
