const bcrypt = require("bcrypt");

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
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return res.render("signup", {
          message: "Something Went wrong! Please Try Again",
        });
      }
      const newUser = {
        fullName: req.body.fullName.trim(),
        email: req.body.email,
        password: hash,
      };
      const user = new User(newUser);
      const savedUser = await user.save();
      if (savedUser) {
        res.status(201).redirect("/user/login");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function handleUserLogin(req, res) {
  const username = req.body.name;
  const password = req.body.password;

  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.isLoggedIn = true;
      req.session.email = user.email;
      req.session.fullName = user.fullName;
      res.status(200).redirect("/user/dashboard");
    } else {
      res.render("login", { message: "Wrong Email Id or Password" });
    }
  } else {
    res.render("login", { message: "Wrong Email Id or Password" });
  }
}

function handleUserLogout(req, res) {
  req.session.isLoggedIn = false;
  req.session.email = "";
  req.session.fullName = "";
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
