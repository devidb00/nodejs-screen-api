const Screen = require("../models/Screen");

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000);
}

exports.createScreen = async (req, res) => {
  return res.send({
    msg: "OK",
    response: await Screen({
      activated: false,
      pin: generatePin(),
      network: req.body.network,
      device: req.body.device,
      dimension: req.body.dimension,
    }).save(),
  });
};

exports.nameScreen = async (req, res) => {
  const screen = await Screen.findOneAndUpdate(
    { pin: req.params.pin },
    {
      activated: true,
      orientation: req.body.orientation,
      user: req.body.user,
      name: req.body.name,
    },
    { new: true }
  );
  if (screen)
    return res.send({
      msg: "OK",
      response: screen,
    });
  else return res.sendStatus(404);
};

exports.getScreensByUser = async (req, res) => {
  return res.send({
    msg: "OK",
    response: await Screen.find({ user: req.params.id }),
  });
};

exports.getScreen = async (req, res) => {
  const screen = await Screen.findOne({ _id: req.params.id });
  if (screen)
    return res.send({
      msg: "OK",
      response: screen,
    });

  return res.sendStatus(404);
};

exports.deleteScreen = async (req, res) => {
  await Screen.deleteOne({ _id: req.params.id });
  return res.send({ msg: "OK" });
};

exports.deleteScreens = async (req, res) => {
  await Screen.deleteMany({ activated: false });
  return res.send({ msg: "OK" });
};
