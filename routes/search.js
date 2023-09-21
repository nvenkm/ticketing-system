const express = require("express");
const { handleSearchTickets } = require("../controllers/search");

const searchRouter = express.Router();

searchRouter.get("/tickets", handleSearchTickets);

module.exports = {
  searchRouter,
};
