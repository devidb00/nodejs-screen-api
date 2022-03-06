const Folder = require("../models/Folder");
const File = require("../models/File");
const s3 = require("../middlewares/aws.middleware");

exports.createFolder = async (req, res) => {
  s3.putObject(
    {
      Bucket: "displayapp",
      Key: req.body.path + "/",
    },
    async (err) => {
      if (err) console.log(err, err.stack);
      else
        return res.send(
          await new Folder({ user: req.params.id, ...req.body }).save()
        );
    }
  );
};

exports.getAllFolders = async (req, res) => {
  return res.send({
    folders: await Folder.find({ parent_path: req.body.path }),
    files: await File.find({ path: req.body.path }),
  });
};

exports.deleteFolder = async (req, res) => {
  const { id } = req.params;

  const { path } = await Folder.findOne({ _id: id });

  if (path) {
    const folderObjects = await Folder.find({
      path: { $regex: "^" + `${path}` },
    });
    const fileObjects = await File.find({ path: { $regex: "^" + `${path}` } });

    s3.deleteObjects(
      {
        Bucket: "displayapp",
        Delete: {
          Objects: folderObjects
            .map((folder) => {
              return { path: folder.path + "/" };
            })
            .concat(
              fileObjects.map((file) => {
                return { path: `${file.path}/${file.name}` };
              })
            )
            .reverse()
            .map((i) => ({ Key: i.path })),
        },
      },
      async (err) => {
        if (err) console.log(err, err.data);
        else {
          return res.send({
            folders: await Folder.deleteMany({
              path: { $regex: "^" + `${path}` },
            }),
            files: await File.deleteMany({
              path: { $regex: "^" + `${path}` },
            }),
          });
        }
      }
    );
  }
};
