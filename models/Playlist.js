const mongoose = require("mongoose");

const Playlist = new mongoose.Schema({
  name: { type: String },
  created: { type: Date, default: Date.now },
  screens: [
    {
      activated: { type: Boolean, default: true },
      screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  files: [
    {
      duration: Number,
      file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    },
  ],
});

module.exports = mongoose.model("Playlist", Playlist);
