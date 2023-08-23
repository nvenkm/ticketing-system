const { Ticket } = require("../models/ticket");

async function handleGetAllTickets(req, res) {
  if (!req.session.isLoggedIn && !req.session.employeeIsLoggedIn) {
    console.log("sending to homepage");
    return res.redirect("/");
  }
  const tickets = await Ticket.find({ createdBy: req.session.email });
  res.render("mytickets", {
    tickets,
  });
}

async function handleCreateTicket(req, res) {
  const ticket = new Ticket({
    title: req.body.title,
    createdBy: req.session.email,
    description: req.body.description,
    assignedTo: req.body.assignee,
    priorityLevel: req.body.priority,
  });
  await ticket.save();
  res.redirect("/ticket");
}
async function handleCloseTicket(req, res) {
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
}
module.exports = {
  handleCreateTicket,
  handleCloseTicket,
  handleGetAllTickets,
};
