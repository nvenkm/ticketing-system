const express = require("express");

const {
  handleEmployeeLogin,
  handleEmployeeDashboard,
  handleEmployeeLogout,
  handleEmployeeSendLoginPage,
  handleEmployeeSendHomePage,
} = require("../controllers/employee");

const employeeRouter = express.Router();

employeeRouter.get("/home", handleEmployeeSendHomePage);

employeeRouter.get("/login", handleEmployeeSendLoginPage);

employeeRouter.post("/login", handleEmployeeLogin);

employeeRouter.get("/dashboard", handleEmployeeDashboard);

employeeRouter.get("/logout", handleEmployeeLogout);

module.exports = { employeeRouter };
