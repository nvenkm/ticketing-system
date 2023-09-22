const { Ticket } = require("../models/ticket");

async function handleGetAllTickets(req, res) {
  if (!req.session.adminIsLoggedIn) {
    return res.send("You are not authorised");
  }
  let query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.priorityLevel) {
    query.priorityLevel = req.query.priorityLevel;
  }

  if (req.query.department) {
    query.assignedTo = req.query.department;
  }

  let sortQuery = req.query.sort || "createdAt";
  // console.log(sortQuery);
  // console.log(query);

  // const page = parseInt(req.query.page) || 1;
  // const perPage = 6;

  const tickets = await Ticket.find(query).sort({ [sortQuery]: "asc" });
  // .skip((page - 1) * perPage)
  // console.log(tickets);
  // .limit(perPage);

  const totalTickets = await Ticket.countDocuments(query);
  // console.log(totalTickets);
  // const totalPages = Math.ceil(totalTickets / perPage);

  res.json({
    totalTickets,
    tickets,
    // currentPage: page,
    // totalPages,
    departments: ["Customer", "IT", "Sales", "HR", "Finance", "Marketing"],
  });
}

async function handleGetAllUserTickets(req, res) {
  if (!req.session.isLoggedIn) {
    // console.log("sending to homepage");
    return res.redirect("/");
  }
  const tickets = await Ticket.find({ createdBy: req.session.email });
  res.render("displayusertickets", {
    tickets,
  });
}

async function handleGetAllEmployeeTickets(req, res) {
  if (!req.session.employeeIsLoggedIn) {
    // console.log("sending to homepage");
    return res.redirect("/");
  }
  const tickets = await Ticket.find({ createdBy: req.session.email });
  res.render("displayemployeetickets", {
    tickets,
    departments: ["Customer", "IT", "Sales", "HR", "Finance", "Marketing"],
  });
}

async function handleCreateTicket(req, res) {
  let pRank;
  if (req.body.priority === "low") {
    pRank = 3;
  }
  if (req.body.priority === "medium") {
    pRank = 2;
  }
  if (req.body.priority === "high") {
    pRank = 1;
  }
  const ticket = new Ticket({
    title: req.body.title,
    createdBy: req.session.email,
    description: req.body.description,
    assignedTo: req.body.assignee,
    priorityLevel: req.body.priority,
    priorityRank: pRank,
  });
  await ticket.save();
  res.redirect("/");
}

async function handleCloseTicket(req, res) {
  try {
    const id = req.params.id;
    console.log(id);
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
  handleGetAllTickets,
  handleCreateTicket,
  handleCloseTicket,
  handleGetAllUserTickets,
  handleGetAllEmployeeTickets,
};
