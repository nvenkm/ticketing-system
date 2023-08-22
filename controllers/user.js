const { User } = require("../models/user");

function handleSendUserSignupPage(req, res) {
  if (req.session.isLoggedIn) {
    return res.redirect("/user/dashboard");
  }
  res.render("signup");
}
function handleSendUserDashboardPage(req, res) {
  if (!req.session.isLoggedIn) {
    return res.redirect("/user/login");
  }
  try {
    res.render("dashboard", {
      departments: ["Lakshmi Chit Fund", "SBI"],
      username: req.session.fullName,
    });
  } catch (error) {
    console.log("ERROR FETCHING TICKETS:", error.message);
    res.status(500).send("Internal Server Error");
  }
}

function handleSendUserLoginPage(req, res) {
  if (req.session.isLoggedIn) {
    return res.redirect("/user/dashboard");
  }
  res.render("login");
}

async function handleUserSignup(req, res) {
  try {
    if (await User.findOne({ email: req.body.email.trim().toLowerCase() })) {
      return res.render("signup", { message: "User Already Exists" });
    }
    if (req.body.password.includes(" ")) {
      return res.render("signup", { message: "Enter a valid Password" });
    }
    const newUser = {
      fullName: req.body.fullName.trim().toLowerCase(),
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
    };
    // console.log(newUser);
    // console.log(req.body);
    const user = new User(newUser);
    const savedUser = await user.save();
    if (savedUser) {
      res.status(201).redirect("/user/login");
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function handleUserLogin(req, res) {
  const user = await User.findOne({
    name: req.body.name,
    password: req.body.password,
  });
  if (user) {
    req.session.isLoggedIn = true;
    req.session.email = user.email;
    req.session.fullName = user.fullName;
    req.session.userType = user.userType;
    res.status(200).redirect("/user/dashboard");
  } else {
    res.render("login", { message: "Wrong Email Id or Password" });
  }
}

function handleUserLogout(req, res) {
  req.session.isLoggedIn = false;
  res.redirect("/");
}

module.exports = {
  handleSendUserSignupPage,
  handleSendUserDashboardPage,
  handleSendUserLoginPage,
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};
