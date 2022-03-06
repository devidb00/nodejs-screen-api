const File = require("../models/File");
const s3 = require("../middlewares/aws.middleware");
const path = require("path");
const Folder = require("../models/Folder");
const { getVideoDurationInSeconds } = require("get-video-duration");

exports.createFile = async (req, res) => {
  const folder = await Folder.findOne({ path: req.body.path });
  req.files?.forEach((file, index) => {
    s3.upload(
      {
        Bucket: "displayapp",
        Key: `${folder.path}/${file.originalname}`,
        ACL: "public-read",
        Body: file.buffer,
        ContentType: file.mimetype,
      },
      async (err, data) => {
        if (err) console.log(err, err.stack);
        else {
          if (file.mimetype.split("/")[0] === "video") {
            getVideoDurationInSeconds(`http://${data.Location}`).then(
              async (duration) => {
                await new File({
                  name: file.originalname,
                  type: file.mimetype,
                  image_url: data.Location,
                  extension: path.extname(file.originalname),
                  folder: req.body.folder,
                  path: folder.path,
                  duration: parseInt(duration) + 1,
                }).save(() => {
                  if (index === 0) return res.status(200).send({ msg: "OK" });
                });
              }
            );
          } else {
            await new File({
              name: file.originalname,
              type: file.mimetype,
              image_url: data.Location,
              extension: path.extname(file.originalname),
              folder: req.body.folder,
              path: folder.path,
            }).save(() => {
              if (index === 0) return res.status(200).send({ msg: "OK" });
            });
          }
        }
      }
    );
  });
};

exports.deleteFile = async (req, res) => {
  const file = await File.findOne({ _id: req.params.id });
  s3.deleteObject(
    {
      Bucket: "displayapp",
      Key: `${file.path}/${file.name}`,
    },
    async (err) => {
      if (err) console.log(err, err.stack);
      else res.send(await File.deleteOne({ _id: file._id }));
    }
  );
};

exports.getUserFiles = async (req, res) => {
  return res.send(await File.find({ user: req.params.id }).sort("name"));
};
