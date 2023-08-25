const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  messageText: {
    type: String,
    default: "",
  },
  ticketId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  file: {
    type: String,
    default: "",
  },
  fileType: {
    type: String,
    default: "",
  },
});

const Message = new mongoose.model("Message", messageSchema);

module.exports = {
  Message,
};
