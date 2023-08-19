const express = require("express");

const {
  handleResolverLogin,
  handleResolverDashboard,
  handleResolverLogout,
  handleResolverSendLoginPage,
  handleResolverSendHomePage,
} = require("../controllers/resolver");

const resolverRouter = express.Router();

resolverRouter.get("/home", handleResolverSendHomePage);

resolverRouter.get("/login", handleResolverSendLoginPage);

resolverRouter.post("/login", handleResolverLogin);

resolverRouter.get("/dashboard", handleResolverDashboard);

resolverRouter.get("/logout", handleResolverLogout);

module.exports = { resolverRouter };
