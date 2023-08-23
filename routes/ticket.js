const express = require("express");
const ticketRouter = express.Router();
const {
  handleCreateTicket,
  handleCloseTicket,
  handleGetAllUserTickets,
  handleGetAllEmployeeTickets,
} = require("../controllers/ticket");

ticketRouter.get("/user", handleGetAllUserTickets);

ticketRouter.get("/employee", handleGetAllEmployeeTickets);

ticketRouter.post("/create", handleCreateTicket);

ticketRouter.put("/close/:id", handleCloseTicket);

module.exports = { ticketRouter };
