import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/database.js";
import app from "./app.js";
import setupSocket from "./sockets/socket.js";
import socketAuth from "./sockets/socketAuth.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authenticate every socket connection
  io.use(socketAuth);

  // Initialize socket events
  setupSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();