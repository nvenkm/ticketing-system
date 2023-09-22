const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

//function to add a new Admin
// NOTE: this function will only be called in the index.js file in order to add new admins manually
async function addNewAdmin(name, email, password) {
  const preExistAdmin = await Admin.findOne({ fullName: name });
  if (!preExistAdmin) {
    bcrypt.hash(password, 10, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return console.log(err);
      }
      const newAdmin = {
        fullName: name.trim(),
        email: email,
        password: hash,
      };
      const admin = new Admin(newAdmin);
      const savedAdmin = await admin.save();
    });
  }
}

//send the admin page
function handleSendAdminLoginPage(req, res) {
  if (req.session.adminIsLoggedIn) {
    return res.redirect("/admin/dashboard");
  }
  res.render("adminlogin");
}

//handle admin login
async function handleAdminLogin(req, res) {
  if (req.session.adminIsLoggedIn) {
    return res.redirect("/admin/dashboard");
  }

  const email = req.body.email;
  const password = req.body.password;

  const admin = await Admin.findOne({ email });

  if (admin) {
    //mathing the user enterred password with hash stored in Database
    const match = await bcrypt.compare(password, admin.password);
    if (match) {
      //saving all details in the session
      req.session.adminIsLoggedIn = true;
      req.session.adminFullName = admin.fullName;
      req.session.adminEmail = admin.email;
      res.redirect("/admin/dashboard");
    } else {
      return res.render("adminlogin", { message: "Wrong Email and Password" });
    }
  } else {
    return res.render("adminlogin", { message: "Wrong Email and Password" });
  }
}

//handle logout
function handleAdminLogout(req, res) {
  // resetting session variables
  req.session.adminIsLoggedIn = false;
  req.session.adminFullName = "";
  res.redirect("/");
}

//send dashboard if admin is logged in
function handleSendAdminDashboard(req, res) {
  if (!req.session.adminIsLoggedIn) {
    return res.redirect("/");
  }

  res.render("admindashboard", {
    departments: ["Customer", "IT", "Sales", "HR", "Finance", "Marketing"],
  });
  //   res.render("admindashboard");
}

module.exports = {
  handleSendAdminLoginPage,
  handleAdminLogin,
  handleAdminLogout,
  handleSendAdminDashboard,
  addNewAdmin,
};
