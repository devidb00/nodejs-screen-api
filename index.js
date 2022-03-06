const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");
require("dotenv").config({ path: "./.env" });

// Routers
const screenRouter = require("./routes/screen.route");
const playlistRouter = require("./routes/playlist.route");
const userRouter = require("./routes/user.route");
const fileRouter = require("./routes/file.route");
const folderRouter = require("./routes/folder.route");

// Main server
const app = express();

// DB Connection
mongoose.connect(
  `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.iee1y.mongodb.net/DisplayDB?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to MongoDB Database..")
);

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/screen", screenRouter);
app.use("/playlist", playlistRouter);
app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

const server = app.listen(5001, () =>
  console.log("Serveur launched on port 5000")
);

// Socket server
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
  });

  socket.on("naming", (data) => {
    io.to(data?.response?._id).emit("naming", {
      msg: "Screen modified !",
      data,
    });
  });

  socket.on("delete", ({ _id }) => {
    io.to(_id).emit("delete", {
      msg: "DELETED",
      id: _id,
    });
  });

  socket.on("remove", (id) => {
    io.to(id).emit("content", {
      msg: "CONTENT DELETED",
      id,
    });
  });

  socket.on("playlist", (id) => {
    io.to(id).emit("playlist", {
      msg: "PLAYLIST",
      id,
    });
  });
});
