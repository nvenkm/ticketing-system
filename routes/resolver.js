const express = require("express");
const { Resolver } = require("../models/resolver");
const { Ticket } = require("../models/ticket");

const session = require("express-session");

const resolverRouter = express.Router();

resolverRouter.get("/login", (req, res) => {
  if (req.session.resolverIsLoggedIn) {
    return res.render("resolverDashboard");
  }
  res.render("resolverLogin");
});

resolverRouter.post("/login", async (req, res) => {
  try {
    const resolver = await Resolver.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(resolver);
    if (!resolver) {
      return res.render("resolverLogin", {
        message: "Incorrect Username or Password",
      });
    }
    req.session.resolverIsLoggedIn = true;
    req.session.email = resolver.email;
    req.session.name = resolver.fullName;
    req.session.department = resolver.department;

    res.redirect("/resolver/dashboard");
  } catch (error) {
    console.log(error.message);
  }
});

resolverRouter.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.resolverIsLoggedIn) {
      return res.redirect("/resolver/login");
    }
    const tickets = await Ticket.find({ assignedTo: req.session.department });
    res.render("resolverDashboard", { tickets });
  } catch (error) {}
});

resolverRouter.get("/logout", (req, res) => {
  if (!req.session.resolverIsLoggedIn) {
    return res.redirect("/resolver/login");
  }
  req.session.resolverIsLoggedIn = false;
  res.redirect("/");
});

module.exports = { resolverRouter };
