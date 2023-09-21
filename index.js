const dotenv = require("dotenv");
const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);
const session = require("express-session");
const ejs = require("ejs");
const { userRouter } = require("./routes/user");
const { ticketRouter } = require("./routes/ticket");
const { employeeRouter } = require("./routes/employee");
const { chatRouter } = require("./routes/chat");
const { adminRouter } = require("./routes/admin");
const { searchRouter } = require("./routes/search");
const mongoose = require("mongoose");

const { log } = require("util");
const { Message } = require("./models/message");
dotenv.config();
const multer = require("multer");

const brcypt = require("bcrypt");

const PORT = process.env.PORT;
const uri = process.env.URL;

//connect to mongoDB
mongoose.connect(uri).then(() => {
  console.log("Database Connected");
});

//set the view engine
app.set("view engine", "ejs");

// middlewares

//use express session
app.use(
  session({
    secret: "top-secret",
    resave: false,
    saveUninitialized: false,
  })
);

//multer

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

//routes
app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/employee", employeeRouter);
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);
app.use("/search", searchRouter);

app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/user/dashboard");
  } else if (req.session.employeeIsLoggedIn) {
    return res.redirect("/employee/dashboard");
  } else if (req.session.adminIsLoggedIn) {
    return res.redirect("/admin/dashboard");
  }
  res.render("home");
});

//creating the server
server.listen(PORT, () => {
  console.log(`Server Runnning on PORT ${PORT}`);
});

//socket.io code

io.on("connection", (socket) => {
  socket.on("join-room", (ticketId) => {
    socket.join(ticketId);
  });
  console.log("A user connected");

  socket.on("chat-message", (data) => {
    io.to(data.ticketId).emit("chat-message", {
      message: data.messageText,
      sentBy: data.sender,
      file: data.file,
      fileType: data.fileType,
    });
  });
});

const { addNewAdmin } = require("./controllers/admin");

addNewAdmin("newAdmin", "newadmin@gmail.com", process.env.ADMIN_1_PASSWORD);
