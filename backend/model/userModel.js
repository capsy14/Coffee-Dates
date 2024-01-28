const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter a email"],
      unique: true,
    },
    gender: {
      type: String,
      required: [true, "Please enter your gender"],
    },
    bio: {
      type: String,
      default: "Hello i am interested for a coffee Date",
    },
    password: {
      type: String,
      min: [6, "Must be at least 6, got {VALUE}"],
      required: [true, "Please enter password"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp",
    },
    phone: {
      type: String,
      max: [250, "Max length can be 23, got {VALUE}"],
      default: "+91 xxxxx",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
