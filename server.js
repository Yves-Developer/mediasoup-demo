// src/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mediasoup = require("mediasoup");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MediaSoup server setup
const mediasoupServer = require("./mediasoup-config");

// Express server setup
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", async ({ username, roomId }) => {
    console.log(`${username} is joining room: ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit("roomJoined", { username, roomId });

    socket.on("newParticipant", ({ id, stream }) => {
      socket.to(roomId).emit("newParticipant", { id, stream });
    });

    socket.on("leaveRoom", ({ username, roomId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("participantLeft", username);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
