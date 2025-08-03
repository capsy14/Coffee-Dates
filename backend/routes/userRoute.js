const express = require("express");
const router = express.Router();

const {
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
} = require("../controller/userController");
const { authMiddleWare } = require("../Middleware/authMiddleWare");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/getuser", authMiddleWare, getUser);
router.get("/loggedin", getLoginStatus);
router.patch("/updateuser", authMiddleWare, updateUser);
router.patch("/changepass", authMiddleWare, changePasssword);
router.post("/forgotpass", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.get("/opposite", authMiddleWare, oppositeGender);
router.post("/opposite/profile", oppositeProfile);
router.post("/addmatch", authMiddleWare, addMatch);
router.post("/removematch", authMiddleWare, removeMatch);

module.exports = router;
