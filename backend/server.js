// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const http = require("http");
// const { Server } = require("socket.io");
// const cookieParser = require("cookie-parser");

// const userRouter = require("./routes/userRoute");
// const messageRoute = require("./routes/messageRoute");
// const { ErrorHandler } = require("./Middleware/errorMiddleWare");
// const { authMiddleWare } = require("./Middleware/authMiddleWare");

// const PORT = process.env.PORT || 5000;
// const app = express();
// const server = http.createServer(app);

// // Socket.IO setup
// const io = require("socket.io")(server, {
//   cors: {
//     origin: [
//       "http://localhost:5000",
//       "https://koffee-ka-chakkar01.vercel.app",
//       "https://koffee-ka-chakkar01-git-main-capsy14.vercel.app",
//       "https://koffee-ka-chakkar01-capsy14.vercel.app",
//     ],
//     methods: ["GET", "POST"],
//   },
// });

// // Socket.IO user management
// const users = {};

// const getReceiverSocketId = (receiverId) => {
//   return users[receiverId];
// };

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);
// });

// // Middleware setup
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: [
//       "https://koffee-ka-chakkar01.vercel.app",
//       "https://koffee-ka-chakkar01-git-main-capsy14.vercel.app",
//       "https://koffee-ka-chakkar01-capsy14.vercel.app",
//       "http://localhost:3000",
//     ],
//     credentials: true,
//   })
// );

// // Routes
// app.use("/api/users", userRouter);
// app.use("/api/users/message", messageRoute);
// app.use(ErrorHandler);

// // MongoDB connection and server start
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
//   })
//   .catch((error) => console.log(error));

// module.exports = { app, io, server, getReceiverSocketId };

/**
 * **************
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const { ErrorHandler } = require("./Middleware/errorMiddleWare");
const { authMiddleWare } = require("./Middleware/authMiddleWare");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://koffee-ka-chakkar01.vercel.app",
      "https://koffee-ka-chakkar01-git-main-capsy14.vercel.app",
      "https://koffee-ka-chakkar01-capsy14.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRouter);
app.use("/api/users/message", messageRoute);
app.use(ErrorHandler);

/*****************************Socket******************************************* */
const users = {}; // Array to track online users

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// When a user connects
io.on("connection", (socket) => {
  console.log(`⚡ : ${socket.id} user just connected`);

  // Add user to the users array
  socket.on("userConnected", (userId) => {
    if (userId) {
      users[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(users));
    }
  });

  // Handling sending messages
  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, message } = data;
    let receiverSocket = null;

    // Correct method to check if user exists
    if (users.hasOwnProperty(receiverId)) {
      receiverSocket = users[receiverId];
    }

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
    }
  });

  // WebRTC Video Call Signaling Events
  socket.on('video-call:offer', ({ receiverId, senderId, offer }) => {
    console.log('📞 Forwarding call offer from', senderId, 'to', receiverId);
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('video-call:offer', { offer, senderId });
    } else {
      console.log('❌ Receiver not found:', receiverId);
    }
  });

  socket.on('video-call:answer', ({ receiverId, senderId, answer }) => {
    console.log('📞 Forwarding call answer from', senderId, 'to', receiverId);
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('video-call:answer', { answer, senderId });
    }
  });

  socket.on('video-call:ice-candidate', ({ receiverId, senderId, candidate }) => {
    console.log('🧊 Forwarding ICE candidate from', senderId, 'to', receiverId);
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('video-call:ice-candidate', { candidate, senderId });
    }
  });

  socket.on('video-call:end', ({ receiverId, senderId }) => {
    console.log('📵 Call ended between', senderId, 'and', receiverId);
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('video-call:end', { senderId });
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    // Find and remove the disconnected user
    const disconnectedUserId = Object.keys(users).find(
      (userId) => users[userId] === socket.id
    );

    if (disconnectedUserId) {
      delete users[disconnectedUserId];
      io.emit("getOnlineUsers", Object.keys(users));
    }
  });
});

/*****************************Socket******************************************* */

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch((error) => console.log(error));

module.exports = { app, io, server };
