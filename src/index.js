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
const app = require('https').createServer(options, expressApp);
const io = socket(app);


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
  const users = [];

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

  // salva os sockets online no momento de login
  socket.on("login", (data) => {
    users.push(data);
    socket.broadcast.emit("login", data);
    // mandar para o socket que fez o login os usuários online
    socket.emit("usersOnline", users);
  });

  socket.on("logout", (user) => {
    socket.broadcast.emit("logout", user);
  });
});

app.listen(443, () => {
  console.clear();
  console.log(
    `Server started on port ${443}/`
  );
});
