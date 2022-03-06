const mongoose = require("mongoose");

const Screen = new mongoose.Schema({
  name: { type: String },
  pin: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  activated: { type: Boolean },
  created: { type: Date, default: new Date() },
  orientation: { type: String },
  device: {
    brand: { type: String },
    model: { type: String },
    os: { type: String },
    osVersion: { type: String },
  },
  network: {
    local_ip: { type: String },
    public_ip: { type: String },
    state: { type: String },
  },
  dimension: {
    width: { type: String },
    height: { type: String },
  },
});

module.exports = mongoose.model("Screen", Screen);
