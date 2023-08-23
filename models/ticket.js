const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    default: "Customer",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  priorityLevel: {
    type: String,
    required: true,
    default: "medium",
  },
});

const Ticket = new mongoose.model("Ticket", ticketSchema);

module.exports = { Ticket };
