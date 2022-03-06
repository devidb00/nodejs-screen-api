const screenRouter = require("express").Router();
const {
  createScreen,
  nameScreen,
  getScreensByUser,
  getScreen,
  deleteScreen,
  deleteScreens,
} = require("../controllers/screen.controller");

screenRouter.post("/create", createScreen);
screenRouter.put("/:pin/name", nameScreen);
screenRouter.get("/:id/user", getScreensByUser);
screenRouter.get("/:id", getScreen);
screenRouter.delete("/:id", deleteScreen);
screenRouter.delete("/", deleteScreens);

module.exports = screenRouter;
