const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
//easily access the data sent in the request body
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const { ErrorHandler } = require("./Middleware/errorMiddleWare");
var cookieParser = require("cookie-parser");
const { authMiddleWare } = require("./Middleware/authMiddleWare");
const { app, server } = require("./socketIo/server");
const messageRoute = require("./routes/messageRoute");
const PORT = process.env.PORT || 5000;

//connect to mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, console.log(`Server running on PORT ${PORT}`));
  })
  .catch((error) => console.log(error));

// Middlewares
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

//Route Middleware
app.use("/api/users", userRouter);
app.use("/api/users/message", messageRoute);

app.use(ErrorHandler);
