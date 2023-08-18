const express = require("express");
const session = require("express-session");
const userRouter = express.Router();
const mongoose = require("mongoose");

const { User } = require("../models/user");
userRouter.get("/signup", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/user/dashboard");
  }
  res.render("signup");
});

userRouter.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/user/dashboard");
  }
  res.render("login");
});
userRouter.get("/dashboard", async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/user/login");
  }
  try {
    res.render("dashboard", {
      departments: ["Lakshmi Chit Fund", "SBI"],
    });
  } catch (error) {
    console.log("ERROR FETCHING TICKETS:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    if (await User.findOne({ email: req.body.email })) {
      return res.render("signup", { message: "User Already Exists" });
    }
    const user = new User(req.body);
    const savedUser = await user.save();
    if (savedUser) {
      res.redirect("/user/login");
    }
  } catch (error) {
    console.log(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  const user = await User.findOne({
    name: req.body.name,
    password: req.body.password,
  });
  if (user) {
    req.session.isLoggedIn = true;
    req.session.email = user.email;
    req.session.fullName = user.fullName;
    req.session.userType = user.userType;
    res.redirect("/user/dashboard");
  } else {
    res.render("login", { message: "Wrong Email Id or Password" });
  }
});

userRouter.get("/logout", (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect("/");
});

module.exports = { userRouter };
