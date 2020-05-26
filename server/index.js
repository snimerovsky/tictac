const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const cors = require("cors");

const {
  addUser,
  removeUser,
  getRandomPlayer,
  getUser,
  getUsersInRoom,
  getNamePlayer,
  getUserById,
} = require("./socketUsers");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const config = require("./config");
const port = process.env.PORT || 4002;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.set("jwt-secret", config.secret);
app.use("/api", require("./routes/api"));

io.on("connect", function (socket) {
  socket.on("join", ({ name, coins, token, isByName }) => {
    const { user } = addUser({ id: socket.id, name, coins, token, isByName });
    socket.userId = socket.id;

    socket.on("randomPlayer", ({ name }) => {
      const player = getRandomPlayer(name);
      if (player) {
        player.active = false;
        player.cross = Math.floor(Math.random() * 10) >= 5 ? true : false;
        user.active = false;
        user.cross = !player.cross;
        io.sockets.connected[player.id].join(user.name);
        io.sockets.connected[user.id].join(user.name);
        user.room = user.name;
        player.room = user.name;
        io.to(user.name).emit("data", {
          data: { room: user.name, you: player, player: user },
        });
      }
    });
    socket.on("namePlayer", ({ name, usernameType }) => {
      const player = getNamePlayer(name, usernameType);
      if (player) {
        console.log("player", player);
        player.active = false;
        player.cross = Math.floor(Math.random() * 10) >= 5 ? true : false;
        user.active = false;
        user.cross = !player.cross;
        io.sockets.connected[player.id].join(user.name);
        io.sockets.connected[user.id].join(user.name);
        user.room = user.name;
        player.room = user.name;
        io.to(user.name).emit("data", {
          data: { room: user.name, you: player, player: user },
        });
      }
    });
    socket.on("pushBlock", ({ id, room, cross }) => {
      io.to(room).emit("pushBlockTo", {
        id,
        isCross: cross.cross,
        isMove: cross.isMove,
      });
    });
    socket.on("updateCoins", ({ user, coins }) => {
      socket.to(user.id).emit("coins", coins);
    });
    socket.on("leaveGame", ({ you, player, room }) => {
      io.to(room).emit("leaveGameUsers");
      socket.broadcast.to(you.id).leave(room);
      socket.broadcast.to(player.id).leave(room);
      let youUser = removeUser(you.id);
      let playerUser = removeUser(player.id);
    });
    socket.on("forceGame", (data) => {
      io.to(data.room).emit("forceGameGet", {
        you: data.you,
        player: data.player,
      });
      socket.broadcast.to(data.you.id).leave(data.room);
    });
  });
  socket.on("disconnect", () => {
    const user = getUserById(socket.id);
    if (user) {
      io.to(user.room).emit("disconnectGame");
    }
  });
});

mongoose.set("useFindAndModify", false);

mongoose.connect(
  process.env.MONGODB_URI ||
    config.mongodbUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log("Connected to mongodb");
    } else {
      console.log(err);
      console.log("Error connection to database");
    }
  },
);

server.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});
