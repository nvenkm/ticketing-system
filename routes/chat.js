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

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "pdf" ||
    file.mimetype.split("/")[1] === "jpg" ||
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "png" ||
    file.mimetype.split("/")[1] === "svg" ||
    file.mimetype.split("/")[1] === "gif" ||
    file.mimetype.split("/")[1] === "bpm"
  ) {
    req.fileType = file.mimetype.split("/")[1];
    cb(null, true);
  } else {
    req.wrongFileExtension = "Only Images and PDF files are allowed!";
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

// chatRouter.get("/", handleSendChatPage);
chatRouter.get("/", handleChat);

chatRouter.post("/message", upload.single("file"), handleChatMessage);

module.exports = {
  chatRouter,
};
