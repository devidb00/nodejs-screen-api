const userRouter = require("express").Router();
const {
  createUser,
  deleteUser,
  connectUser,
  getUser,
} = require("../controllers/user.controller");

userRouter.post("/create", createUser);
userRouter.delete("/:id/delete", deleteUser);
userRouter.post("/login", connectUser);
userRouter.get("/:id", getUser);

module.exports = userRouter;
