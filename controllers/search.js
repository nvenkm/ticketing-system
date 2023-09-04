const { Ticket } = require("../models/ticket");

async function handleSearchTickets(req, res) {
  if (!req.session.adminIsLoggedIn) {
    return res.redirect("/");
  }
  console.log(req.query);
  if (req.query.search) {
    searchQuery = req.query.search;
  }

  const tickets = await Ticket.find({
    $or: [
      { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive title search
      { createdBy: { $regex: searchQuery, $options: "i" } }, // Case-insensitive description search
      { description: { $regex: searchQuery, $options: "i" } },
      { assignedTo: { $regex: searchQuery, $options: "i" } },
      { priorityLevel: { $regex: searchQuery, $options: "i" } },
    ],
  });

  if (tickets) {
    res.json({ tickets });
    console.log(tickets);
  }
}
module.exports = {
  handleSearchTickets,
};
