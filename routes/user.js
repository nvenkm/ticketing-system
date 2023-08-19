const express = require("express");

const userRouter = express.Router();

const {
  handleSendUserSignupPage,
  handleSendUserLoginPage,
  handleSendUserDashboardPage,
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
} = require("../controllers/user");

userRouter.get("/signup", handleSendUserSignupPage);

userRouter.get("/login", handleSendUserLoginPage);

userRouter.get("/dashboard", handleSendUserDashboardPage);

userRouter.post("/signup", handleUserSignup);

userRouter.post("/login", handleUserLogin);

userRouter.get("/logout", handleUserLogout);

module.exports = { userRouter };
