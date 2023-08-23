const { Employee } = require("../models/employee");
const { Ticket } = require("../models/ticket");

function handleEmployeeSendLoginPage(req, res) {
  if (req.session.employeeIsLoggedIn) {
    // return res.render("employeeDashboard");
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

async function handleEmployeeLogin(req, res) {
  try {
    const employee = await Employee.findOne({
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    });
    // console.log(employee);
    if (!employee) {
      return res.render("employeeLogin", {
        message: "Incorrect Username or Password",
      });
    }
    req.session.employeeIsLoggedIn = true;
    req.session.email = employee.email;
    req.session.name = employee.fullName;
    req.session.department = employee.department;

    res.redirect("/employee/dashboard");
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
  res.redirect("/");
}

module.exports = {
  handleEmployeeSendLoginPage,
  handleEmployeeSendHomePage,
  handleEmployeeLogin,
  handleEmployeeDashboard,
  handleEmployeeLogout,
};
