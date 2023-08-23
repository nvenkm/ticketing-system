const io = require("socket.io");
const mongoose = require("mongoose");
const User = require("../models/user");
const Ticket = require("../models/ticket");
const { Message } = require("../models/message");

function handleSendChatPage(req, res) {
  res.render("chat");
}

async function handleChat(req, res) {
  if (!req.session.isLoggedIn && !req.session.employeeIsLoggedIn) {
    res.redirect("/");
  }
  if (req.session.isLoggedIn || req.session.employeeIsLoggedIn) {
    const ticketId = req.query.ticketId;
    // console.log(req.session.fullName || req.session.name, ticketId);

    const oldMessages = await Message.find({ ticketId });
    res.render("chat", {
      ticketId,
      username: req.session.fullName || req.session.name,
      oldMessages,
    });

    // res.render("chat", req.session.username || req.session.name);
  }
}

module.exports = {
  handleChat,
  handleSendChatPage,
};
