const folderRouter = require("express").Router();
const {
  createFolder,
  getAllFolders,
  deleteFolder,
} = require("../controllers/folder.controller");

folderRouter.post("/create/:id", createFolder);
folderRouter.post("/", getAllFolders);
folderRouter.delete("/:id", deleteFolder);

module.exports = folderRouter;
