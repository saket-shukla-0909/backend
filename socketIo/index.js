const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://frontend-k5pu.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

module.exports = { app, server, io }; // ✅ CommonJS export
