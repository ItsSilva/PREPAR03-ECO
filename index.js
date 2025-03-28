const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "/real-time",
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

let users = [];
let messages = [];

//get route for users
app.get("/users", (req, res) => {
  res.send(users);
});

//post route for register
app.post("/users", (req, res) => {
  const dataUser = req.body;

  if (!dataUser.username) {
    return res.status(400).send({ message: "All fields are required" });
  }
  const userExists = users.some((user) => user.username === dataUser.username);
  if (userExists) {
    return res.status(400).send({ message: "User already exists" });
  }

  const userId = Math.floor(Math.random() * 1000000);

  const newUser = {
    id: userId,
    username: dataUser.username,
  };

  users.push(newUser);
  res.status(201).json(newUser);

  io.emit("new-user", newUser);
});

//get route for messages
app.get("/messages", (req, res) => {
  res.send(messages);
});

//post route for messages
app.post("/messages", (req, res) => {
  const dataMessage = req.body;

  if (!dataMessage.message) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const messageId = Math.floor(Math.random() * 1000000);

  const newMessage = {
    id: messageId,
    message: dataMessage.message,
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);

  io.emit("new-message", newMessage);
});

httpServer.listen(5050);
