const { getMessage, sendMessage } = require("../controller/messageController");

const express = require("express");
const { authMiddleWare } = require("../Middleware/authMiddleWare");

const messageRoute = express.Router();
messageRoute.post("/send/:id", authMiddleWare, sendMessage);
messageRoute.get("/get/:id", authMiddleWare, getMessage);

module.exports = messageRoute;
