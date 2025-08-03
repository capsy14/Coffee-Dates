const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Token = require("../model/userToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = async (req, res) => {
  const { name, email, photo, password, gender } = req.body;
  if (!name || !email || !password) {
    throw new Error("please fill the req fields");
  }
  if (password.length < 6) {
    throw new Error("Please enter password of lenght 6-23");
  }
  const userExist = await User.findOne({ email: email }).exec();
  if (userExist) {
    throw new Error("This user already exist");
  }
  var salt = bcrypt.genSaltSync(10);
  var encrp_password = bcrypt.hashSync(password, salt);

  const user = await User.create({
    name: name,
    email: email,
    password: encrp_password,
    gender: gender,
    photo: photo,
  });
  const token = generateToken(user._id);
  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });
  res.status(200).send({
    user,
    token,
  });
  if (!user) {
    throw new Error("Some error occured");
  }
  // res.send("Reister suse");
};

const loginUser = asyncHandler(async (req, res, next) => {
  // console.log("hit ho gaya");
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("please fill the req fields");
  }
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    throw new Error("This user does not exits");
  }
  const isPasswordCorrect = bcrypt.compareSync(password, user.password); // true
  // console.log(isPasswordCorrect);
  if (isPasswordCorrect) {
    // Send HTTP-only cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    res.send({
      user,
      token: token,
      message: "logged in",
    });
  } else {
    throw new Error("Something wrong");
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).send({ message: "Successfully logged out" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio, gender, matches } = user;
    res.status(200).json({
      _id,
      name,
      email,
      gender,
      photo,
      phone,
      bio,
      matches,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token.length) {
    return res.json(false);
  }
  var exist = jwt.verify(token, JWT_SECRET);
  if (exist) {
    return res.json(true);
  }
  return res.json(false);
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, photo, bio, phone, gender } = req.body;
  // console.log(photo);
  const id = req.user._id;
  const user = await User.findById(id);
  if (!user) {
    res.status(400);
    throw new Error("User Not Found");
  }
  user.name = name || user.name;
  user.photo = photo || user.photo;
  user.gender = gender || user.gender;
  user.bio = bio || user.bio;
  user.phone = phone || user.phone;
  const updatedUser = await user.save();
  res.status(200).send(updatedUser);
});

const changePasssword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { oldPassword, newPassword } = req.body;
  const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Password is not correct");
  }
  var salt = bcrypt.genSaltSync(10);
  var newHashPassword = bcrypt.hashSync(newPassword, salt);
  user.password = newHashPassword;
  await user.save();
  res.status(202).json({ message: " password updated successfully" });
});

/**
 * ```js
 * use to reset password
 * ```
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400);
    throw new Error("User doesn't exist");
  }
  //check if token exist
  const token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  // Create Reste Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  // console.log(resetToken);

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // console.log(hashedToken);
  const newToken = await Token.create({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000),
  });

  const new_url = `${process.env.FRONTEND_URL}/api/users/resetpassword/${hashedToken}`;
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>  
  <p>This reset link is valid for only 30minutes.</p>

  <a href=${new_url} clicktracking=off>${new_url}</a>

  <p>Regards...</p>
  <p>Koffee Ka Chakkar</p>
`;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const password = req.body.password;
  const token = req.params.token;
  // Hash token, then compare to Token in DB
  const user_token = await Token.find({
    token: token,
    expiresAt: { $gte: Date.now() },
  }).exec();
  // console.log(user_token[0]);
  if (!user_token) {
    res.status(401);
    throw new Error("Some thing wrong");
  }
  const user = await User.findOne({ _id: user_token[0].userId });
  var salt = bcrypt.genSaltSync(10);
  var newPassword = bcrypt.hashSync(password, salt);
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});

const oppositeGender = asyncHandler(async (req, res) => {
  // console.log("hitt");
  const user = await User.findById(req.user.id);
  // console.log(user + " backend ");
  const { gender } = user;
  const oppositeGender =
    gender && gender.toLowerCase() === "male" ? "female" : "male";
  // console.log(oppositeGender);
  const response = await User.find({ gender: oppositeGender }).exec();
  // console.log(response);
  if (response) {
    res.status(200).send(response);
  } else {
    res.status(401);
    throw new Error("Some thing wrong");
  }
});

const oppositeProfile = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(401);
    throw new Error("Some thing wrong");
  }
});

// Add a match (when user likes/coffee dates someone)
const addMatch = asyncHandler(async (req, res) => {
  const { matchedUserId } = req.body;
  const currentUserId = req.user._id;

  try {
    // Add the matched user to current user's matches
    const currentUser = await User.findById(currentUserId);
    if (!currentUser.matches.includes(matchedUserId)) {
      currentUser.matches.push(matchedUserId);
      await currentUser.save();
    }

    // Also add current user to the matched user's matches (mutual match)
    const matchedUser = await User.findById(matchedUserId);
    if (matchedUser && !matchedUser.matches.includes(currentUserId)) {
      matchedUser.matches.push(currentUserId);
      await matchedUser.save();
    }

    res.status(200).json({ 
      success: true, 
      message: "Match added successfully",
      matches: currentUser.matches 
    });
  } catch (error) {
    res.status(400);
    throw new Error("Error adding match");
  }
});

// Remove a match
const removeMatch = asyncHandler(async (req, res) => {
  const { matchedUserId } = req.body;
  const currentUserId = req.user._id;

  try {
    // Remove the matched user from current user's matches
    const currentUser = await User.findById(currentUserId);
    currentUser.matches = currentUser.matches.filter(id => id !== matchedUserId);
    await currentUser.save();

    // Also remove current user from the matched user's matches
    const matchedUser = await User.findById(matchedUserId);
    if (matchedUser) {
      matchedUser.matches = matchedUser.matches.filter(id => id !== currentUserId);
      await matchedUser.save();
    }

    res.status(200).json({ 
      success: true, 
      message: "Match removed successfully",
      matches: currentUser.matches 
    });
  } catch (error) {
    res.status(400);
    throw new Error("Error removing match");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
  getUser,
  getLoginStatus,
  updateUser,
  changePasssword,
  forgotPassword,
  resetPassword,
  oppositeGender,
  oppositeProfile,
  addMatch,
  removeMatch,
};
