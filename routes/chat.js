const express = require("express");
const { handleChat, handleChatMessage } = require("../controllers/chat");
const { handleSendChatPage } = require("../controllers/chat");
const chatRouter = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// chatRouter.get("/", handleSendChatPage);
chatRouter.get("/", handleChat);

chatRouter.post("/message", upload.single("file"), handleChatMessage);

module.exports = {
  chatRouter,
};
