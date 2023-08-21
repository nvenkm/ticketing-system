const express = require("express");
const ticketRouter = express.Router();
const {
  handleCreateTicket,
  handleCloseTicket,
  handleGetAllTickets,
} = require("../controllers/ticket");

ticketRouter.get("/", handleGetAllTickets);

ticketRouter.post("/create", handleCreateTicket);

ticketRouter.put("/close/:id", handleCloseTicket);

module.exports = { ticketRouter };
