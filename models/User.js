const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  first_name: { type: String },
  last_name: { type: String },
});

module.exports = mongoose.model("User", User);
