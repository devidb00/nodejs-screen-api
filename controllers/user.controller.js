const User = require("../models/User");
const Folder = require("../models/Folder");
const s3 = require("../middlewares/aws.middleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const existingEmail = await User.findOne({ email: req.body.email });

  if (existingEmail)
    return res.send({ msg: "Impossible ! L'adresse email existe déjà." });

  const salt = await bcrypt.genSalt(8);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  await new User({ ...req.body, password: hashPassword })
    .save()
    .then((response) => {
      s3.putObject(
        {
          Bucket: "displayapp",
          Key: `${response._id}/`,
        },
        async (err, data) => {
          if (err) console.log(err, err.stack);
          else {
            await new Folder({
              name: response._id,
              path: response._id,
              user: response._id,
            }).save();
            return res.send({ msg: "OK", data });
          }
        }
      );
    });
};

exports.deleteUser = async (req, res) => {
  await User.deleteOne({ _id: req.params.id }).then(() => {
    s3.deleteObject(
      {
        Bucket: "displayapp",
        Key: `${req.params.id}/`,
      },
      (err, data) => {
        if (err) console.log(err, err.stack);
        else return res.send({ msg: "OK", data });
      }
    );
  });
};

exports.connectUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser)
    return res.status(404).send({ msg: "Le compte saisi n'existe pas !" });

  if (!(await bcrypt.compare(req.body.password, existingUser.password))) {
    return res.status(401).send({ msg: "Le mot de passe est incorrect" });
  } else {
    const token = jwt.sign({ id: existingUser.id }, process.env.SECRET_TOKEN);
    return res.send({ token, data: existingUser });
  }
};

exports.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user)
    return res.send({
      msg: "OK",
      user: user,
    });
  else return res.status(404).send({ msg: "Error" });
};
