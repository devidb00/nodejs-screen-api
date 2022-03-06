const mongoose = require("mongoose");

const FolderSchema = mongoose.Schema({
  name: { type: String },
  path: { type: String },
  parent_path: { type: String },
  files: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Folder", FolderSchema);
