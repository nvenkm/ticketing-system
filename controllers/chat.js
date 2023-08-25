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
      wrongFileExtension: req.wrongFileExtension,
    });

    // res.render("chat", req.session.username || req.session.name);
  }
}

async function handleChatMessage(req, res) {
  if (!req.session.isLoggedIn && !req.session.employeeIsLoggedIn) {
    res.redirect("/");
  }
  try {
    if (req.wrongFileExtension) {
      return res.json({ wrongFileExtension: req.wrongFileExtension });
    }
    const receivedMessage = {
      sender: req.body.sender,
      messageText: req.body.messageText,
      ticketId: req.body.ticketId,
      file: req.file ? req.file.path.slice(6) : "",
      fileType: req.fileType,
    };
    const newMessage = new Message(receivedMessage);
    await newMessage.save();
    console.log(newMessage);
    res.json(newMessage);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  handleChat,
  handleSendChatPage,
  handleChatMessage,
};
