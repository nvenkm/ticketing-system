const express = require("express");
const ticketRouter = express.Router();
const { Ticket } = require("../models/ticket");

ticketRouter.get("/", async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.session.email });
  res.render("mytickets", {
    tickets,
    departments: ["Lakshmi Chit Fund", "SBI"],
  });
});

ticketRouter.post("/create", async (req, res) => {
  const ticket = new Ticket({
    title: req.body.title,
    createdBy: req.session.email,
    description: req.body.description,
    assignedTo: req.body.assignee,
    priorityLevel: req.body.priority,
  });
  await ticket.save();
  res.redirect("/ticket");
  // res.redirect({ tickets }, "/user/dashboard");
});

ticketRouter.put("/close/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTicket = await Ticket.updateOne(
      { _id: id },
      { status: "closed" }
    );
    if (updatedTicket) {
      res.status(200).send("Ticket Updated");
    } else {
      res.status(500).send("Ticket not Found");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { ticketRouter };
