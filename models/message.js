const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  messageText: {
    type: String,
    required: true,
  },
  ticketId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = new mongoose.model("Message", messageSchema);

module.exports = {
  Message,
};
