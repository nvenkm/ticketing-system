const express = require("express");
const app = express();
const session = require("express-session");
const ejs = require("ejs");
const { userRouter } = require("./routes/user");
const { ticketRouter } = require("./routes/ticket");
const { resolverRouter } = require("./routes/resolver");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;
const uri = process.env.URI;

mongoose.connect(uri).then(() => {
  console.log("Database Connected");
});

// middlewares
app.use(
  session({
    secret: "top-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/resolver", resolverRouter);

// routes
app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/user/dashboard");
  }
  res.render("home");
});

//creating the server
app.listen(PORT, () => {
  console.log(`Server Runnning on PORT ${PORT}`);
});
