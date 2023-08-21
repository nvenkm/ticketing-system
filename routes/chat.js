const express = require("express");
const { handleChat } = require("../controllers/chat");
const { handleSendChatPage } = require("../controllers/chat");
const chatRouter = express.Router();

// chatRouter.get("/", handleSendChatPage);
chatRouter.get("/", handleChat);

module.exports = {
  chatRouter,
};
