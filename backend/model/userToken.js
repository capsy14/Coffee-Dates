const mongoose = require("mongoose");
const User = require("./userModel");
const { Schema } = mongoose;

const UserToken = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model("Token", UserToken);
module.exports = Token;
