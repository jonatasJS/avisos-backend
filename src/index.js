require("dotenv").config();

const express = require("express");
// const https = require("https");
const fs = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const socket = require("socket.io");
const path = require("path");
const cors = require("cors");

// ssl certificate
// ca_bundle.crt
// certificater.crt
const options = {
  ca: fs.readFileSync("ca_bundle.crt", {
    encoding: "utf-8",
  }),
  cert: fs.readFileSync("certificate.crt", {
    encoding: "utf-8",
  }),
  key: fs.readFileSync("private.key", {
    encoding: "utf-8",
  }),
};

const expressApp = express();
const app = require('http')//.createServer(options, expressApp);
const io = socket(app);

const users = [];

/**
 * Database setup
 */
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

expressApp.use(cors({
  origin: [
    "http://localhost:3000",
    "*",
    "https://avisos-nextjs.vercel.app",
    "https://avisos.jonatas.app"
  ]
}));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(morgan("dev"));
expressApp.use(express.static(path.resolve(__dirname, "..", "public")));

expressApp.use(require("./routes"));

io.on("connection", (socket) => {

  socket.on("addNewTodo", (data) => {
    socket.broadcast.emit("addNewTodo", data);
  });

  socket.on("deleteTodo", (data) => {
    console.log(Date.now(), data);
    socket.broadcast.emit("deleteTodo", data);
  });

  socket.on("editTodo", (data) => {
    socket.broadcast.emit("editTodo", data);
  });

  socket.on("refreshHome", (data) => {
    console.log(Date.now(), data);
    socket.broadcast.emit("refreshHome", data);
  });

  // salva os sockets online no momento de login
  socket.on("login", (data) => {
    const validate = users.includes(data);
    !validate && users.push(data);
    !validate ? console.log(data) : console.log(validate);
    socket.data.name = data;
    // socket.broadcast.emit("login", data);
    // socket.emit("login", data);
    io.emit("login", ({ data, users }));
    // mandar para o socket que fez o login os usuários online
    // socket.broadcast.emit("usersOnline", users);
    // socket.emit("usersOnline", users);
    io.emit("usersOnline", users);

    console.log("users", users);
    console.log("data", data);
  });

  socket.on("usersOnline", (data) => {
    socket.emit("usersOnline", users);

    console.log("users", users);
    console.log("data", data);
  });

  // remove os sockets offline no momento de logout
  socket.on("logout", (data) => {
    console.log(data)
    users.splice(users.indexOf(data), 1);

    console.log("users", users);
    console.log("data", data);

    socket.broadcast.emit("logout", data);
  });

  socket.on('disconnect', () => {

    users.splice(users.indexOf(socket.data.name), 1);

    console.log("users", users);
    console.log("data", socket.data);

    socket.broadcast.emit("logout", socket.data.name);
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on port ${443}/`
  );
});
