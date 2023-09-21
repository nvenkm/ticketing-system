const express = require("express");
const adminRouter = express.Router();
const {
  handleSendAdminLoginPage,
  handleAdminLogin,
  handleSendAdminDashboard,
  handleAdminLogout,
} = require("../controllers/admin");

adminRouter.get("/login", handleSendAdminLoginPage);

adminRouter.post("/login", handleAdminLogin);

adminRouter.get("/dashboard", handleSendAdminDashboard);

adminRouter.get("/logout", handleAdminLogout);

module.exports = {
  adminRouter,
};
