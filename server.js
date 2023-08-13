// server.js
const express = require("express");
const http = require("http");
const { Server: SocketIO } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new SocketIO(httpServer);

  // Handle Socket.IO events
  io.on("connection", (socket) => {
    // Example: Handle disconnect event
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Handle Next.js requests
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = 3000; // Run on port 3000
  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
