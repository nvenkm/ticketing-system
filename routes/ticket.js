const express = require("express");
const ticketRouter = express.Router();
const {
  handleCreateTicket,
  handleCloseTicket,
  handleGetAllUserTickets,
  handleGetAllEmployeeTickets,
  handleGetAllTickets,
} = require("../controllers/ticket");

ticketRouter.get("/user", handleGetAllUserTickets);

ticketRouter.get("/employee", handleGetAllEmployeeTickets);

ticketRouter.post("/create", handleCreateTicket);

ticketRouter.put("/close/:id", handleCloseTicket);

ticketRouter.get("/all", handleGetAllTickets);

module.exports = { ticketRouter };
