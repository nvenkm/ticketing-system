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
const { resolverRouter } = require("./routes/resolver");
const { chatRouter } = require("./routes/chat");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { log } = require("util");
const { Message } = require("./models/message");
dotenv.config();

const PORT = process.env.PORT;
const uri = process.env.URI;

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

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

//routes
app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/resolver", resolverRouter);
app.use("/chat", chatRouter);

app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/user/dashboard");
  } else if (req.session.resolverIsLoggedIn) {
    return res.redirect("/resolver/dashboard");
  }
  res.render("home");
});

//creating the server
server.listen(PORT, () => {
  console.log(`Server Runnning on PORT ${PORT}`);
});

io.on("connection", (socket) => {
  socket.on("join-room", (ticketId) => {
    socket.join(ticketId);
  });
  console.log("A user connected");

  socket.on("chat-message", async (data) => {
    console.log(data.message);
    const newMessage = new Message({
      sender: data.sender,
      messageText: data.message,
      ticketId: data.ticketId,
    });

    await newMessage.save();

    io.to(data.ticketId).emit("chat-message", {
      message: data.message,
      sentBy: data.sender,
    });
  });
});
