const Admin = require("../models/admin");

function handleSendAdminLoginPage(req, res) {
  if (req.session.adminIsLoggedIn) {
    return res.redirect("/admin/dashboard");
  }
  res.render("adminlogin");
}

async function handleAdminLogin(req, res) {
  if (req.session.adminIsLoggedIn) {
    return res.redirect("/admin/dashboard");
  }

  const admin = await Admin.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!admin) {
    return res.render("adminlogin", { message: "Wrong Email and Password" });
  }

  req.session.adminIsLoggedIn = true;
  req.session.adminFullName = admin.fullName;
  res.redirect("/admin/dashboard");
}

function handleAdminLogout(req, res) {
  req.session.adminIsLoggedIn = false;
  req.session.adminFullName = "";
  res.redirect("/");
}

function handleSendAdminDashboard(req, res) {
  if (!req.session.adminIsLoggedIn) {
    return res.redirect("/");
  }

  res.render("admindashboard");
  //   res.render("admindashboard");
}

module.exports = {
  handleSendAdminLoginPage,
  handleAdminLogin,
  handleAdminLogout,
  handleSendAdminDashboard,
};
