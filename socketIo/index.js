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

const onlineUsers = new Map(); // userId => socket.id

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Save user when connected
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} added with socket ${socket.id}`);
  });

  // Handle send message
  socket.on("send-msg", (data) => {
    const sendToSocket = onlineUsers.get(data.to);
    const senderSocket = socket.id;

    // Emit to recipient
    if (sendToSocket) {
      io.to(sendToSocket).emit("msg-receive", {
        message: data.message,
        from: data.from,
      });

      // Notify sender that message is delivered
      io.to(senderSocket).emit("msg-status-update", {
        to: data.to,
        status: "delivered",
      });
    } else {
      // User is offline; consider saving to DB for future delivery
      io.to(senderSocket).emit("msg-status-update", {
        to: data.to,
        status: "sent",
      });
    }
  });

  // Handle seen acknowledgment
  socket.on("seen-msg", ({ from, to }) => {
    const senderSocket = onlineUsers.get(from);
    if (senderSocket) {
      io.to(senderSocket).emit("msg-status-update", {
        to,
        status: "seen",
      });
    }
  });

  // Disconnect logic
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    [...onlineUsers.entries()].forEach(([userId, sId]) => {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
  });
});

module.exports = { app, server, io };


// const { Server } = require('socket.io');
// const http = require('http');
// const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "https://frontend-k5pu.vercel.app",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`🔌 New client connected: ${socket.id}`);

//   socket.on("disconnect", () => {
//     console.log(`❌ Client disconnected: ${socket.id}`);
//   });
// });

// module.exports = { app, server, io }; // ✅ CommonJS export
