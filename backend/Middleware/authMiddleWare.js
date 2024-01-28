const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleWare = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
  const verified = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(verified.id).exec();
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  //   console.log(user);
  //--------
  req.user = user;
  //--------
  next();
});

module.exports = { authMiddleWare };
