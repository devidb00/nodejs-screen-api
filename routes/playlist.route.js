const {
  getPlaylistsPerUser,
  createPlaylist,
  deletePlaylist,
  getLastPlaylist,
  updatePlaylistActivation,
} = require("../controllers/playlist.controller");

const playlistRouter = require("express").Router();

playlistRouter.get("/:id/user", getPlaylistsPerUser);
playlistRouter.post("/create", createPlaylist);
playlistRouter.delete("/:id/delete", deletePlaylist);
playlistRouter.get("/:id/screen", getLastPlaylist);
playlistRouter.put("/:id/screen", updatePlaylistActivation);

module.exports = playlistRouter;
