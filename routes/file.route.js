const multer = require("multer");
const fileRouter = require("express").Router();

const {
  createFile,
  deleteFile,
  getUserFiles,
} = require("../controllers/file.controller");

fileRouter.post("/upload", multer().array("files"), createFile);
fileRouter.get("/:id/user", getUserFiles);
fileRouter.delete("/:id/delete", deleteFile);

module.exports = fileRouter;
