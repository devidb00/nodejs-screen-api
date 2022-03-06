const mongoose = require("mongoose");

const File = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  extension: { type: String },
  image_url: { type: String },
  path: { type: String },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  duration: { type: Number },
});

module.exports = mongoose.model("File", File);
