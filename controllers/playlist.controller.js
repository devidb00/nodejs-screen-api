const Playlist = require("../models/Playlist");

exports.getPlaylistsPerUser = async (req, res) => {
  return res.send(await Playlist.find({ user: req.params.id }));
};

exports.createPlaylist = async (req, res) => {
  return res.send(await new Playlist({ ...req.body }).save());
};

exports.deletePlaylist = async (req, res) => {
  return res.send(await Playlist.deleteOne({ _id: req.params.id }));
};

exports.getLastPlaylist = async (req, res) => {
  const playlist = await Playlist.findOne({
    "screens._id": req.params.id,
  })
    .sort([["created", -1]])
    .populate({ path: "files._id", model: "File" });

  if (playlist) {
    return res.send(playlist);
  } else {
    return res.send({ files: [] });
  }
};

exports.updatePlaylistActivation = async (req, res) => {
  const { status } = req.body;
  const playlist = await Playlist.findOne({
    "screens._id": req.params.id,
  }).sort([["created", -1]]);

  if (playlist) {
    const screens = playlist?.screens.map((screen) => {
      if (screen._id.equals(req.params.id)) {
        return { activated: status, _id: req.params.id };
      } else {
        return screen;
      }
    });

    return res.send({
      msg: "OK",
      updated: await Playlist.findOneAndUpdate(
        { _id: playlist._id },
        {
          screens,
        },
        { new: true }
      ).populate({ path: "files._id", model: "File" }),
    });
  }

  return res.sendStatus(200);
};
