const { Resolver } = require("../models/resolver");
const { Ticket } = require("../models/ticket");

function handleResolverSendLoginPage(req, res) {
  if (req.session.resolverIsLoggedIn) {
    return res.render("resolverDashboard");
  }
  res.render("resolverLogin");
}

function handleResolverSendHomePage(req, res) {
  if (req.session.resolverIsLoggedIn) {
    return res.redirect("/resolver/dashboard");
  }
  res.redirect("/");
}

async function handleResolverLogin(req, res) {
  try {
    const resolver = await Resolver.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    // console.log(resolver);
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
}

async function handleResolverDashboard(req, res) {
  try {
    if (!req.session.resolverIsLoggedIn) {
      return res.redirect("/resolver/login");
    }
    const tickets = await Ticket.find({ assignedTo: req.session.department });
    res.render("resolverDashboard", {
      tickets,
      resolverName: req.session.name,
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function handleResolverLogout(req, res) {
  if (!req.session.resolverIsLoggedIn) {
    return res.redirect("/resolver/login");
  }
  req.session.resolverIsLoggedIn = false;
  res.redirect("/");
}

module.exports = {
  handleResolverSendLoginPage,
  handleResolverSendHomePage,
  handleResolverLogin,
  handleResolverDashboard,
  handleResolverLogout,
};
