const mongoose = require("mongoose");

const resolverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

const Resolver = new mongoose.model("Resolver", resolverSchema);

module.exports = {
  Resolver,
};
