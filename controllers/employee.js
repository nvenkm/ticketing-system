const { Employee } = require("../models/employee");
const { Ticket } = require("../models/ticket");
const bcrypt = require("bcrypt");

function handleEmployeeSendLoginPage(req, res) {
  if (req.session.employeeIsLoggedIn) {
    return res.redirect("/employee/dashboard");
  }
  res.render("employeeLogin");
}

function handleEmployeeSendHomePage(req, res) {
  if (req.session.employeeIsLoggedIn) {
    return res.redirect("/employee/dashboard");
  }
  res.redirect("/");
}

async function handleAddNewEmployee(req, res) {
  try {
    const fullName = req.body.fullName;
    const department = req.body.department;
    const email = req.body.email;
    const password = req.body.password;

    const hash = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({
      fullName,
      department,
      email,
      password: hash,
    });

    const savedEmployee = newEmployee.save();
    if (savedEmployee) res.redirect("/");
  } catch (e) {
    console.log(e);
  }
}

async function handleEmployeeLogin(req, res) {
  try {
    const email = req.body.employee;
    const password = req.body.password;

    const employee = await Employee.findOne({
      email: req.body.email.trim().toLowerCase(),
    });
    // console.log(employee);
    if (!employee) {
      return res.render("employeeLogin", {
        message: "Incorrect Username or Password",
      });
    }

    const compare = await bcrypt.compare(password, employee.password);
    if (compare) {
      req.session.employeeIsLoggedIn = true;
      req.session.email = employee.email;
      req.session.name = employee.fullName;
      req.session.department = employee.department;

      res.redirect("/employee/dashboard");
    } else {
      return res.render("employeeLogin", {
        message: "Incorrect Username or Password",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function handleEmployeeDashboard(req, res) {
  try {
    if (!req.session.employeeIsLoggedIn) {
      return res.redirect("/employee/login");
    }
    const tickets = await Ticket.find({ assignedTo: req.session.department });
    res.render("employeeDashboard", {
      tickets,
      employeeName: req.session.name,
      departments: ["Customer", "IT", "Sales", "HR", "Finance", "Marketing"],
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function handleEmployeeLogout(req, res) {
  if (!req.session.employeeIsLoggedIn) {
    return res.redirect("/employee/login");
  }
  req.session.employeeIsLoggedIn = false;
  req.session.email = "";
  req.session.name = "";
  req.session.department = "";
  res.redirect("/");
}

module.exports = {
  handleEmployeeSendLoginPage,
  handleEmployeeSendHomePage,
  handleAddNewEmployee,
  handleEmployeeLogin,
  handleEmployeeDashboard,
  handleEmployeeLogout,
};
