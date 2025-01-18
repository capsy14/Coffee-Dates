const mongoose = require("mongoose");
const User = require("./userModel");
const Message = require("./messageModel");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Use the name of the User model
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", // Use the name of the Message model
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
