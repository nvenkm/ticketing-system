const { Ticket } = require("../models/ticket");

async function handleSearchTickets(req, res) {
  try {
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
        // { _id: { $regex: searchQuery } },
      ],
    });

    if (tickets) {
      res.json({ tickets });
      console.log(tickets);
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  handleSearchTickets,
};
