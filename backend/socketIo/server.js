const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5000",
      "https://koffee-ka-chakkar01.vercel.app",
      "https://koffee-ka-chakkar01-git-main-capsy14.vercel.app",
      "https://koffee-ka-chakkar01-capsy14.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

const users = {};

const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("Hello ", users);
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
