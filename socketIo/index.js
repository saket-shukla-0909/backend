const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { Message } = require("../models/messageModel");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.onlineUsers = new Map(); // userId => socketId

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });

  // ✅ Typing Event
  socket.on("typing", ({ to, from }) => {
    const receiverSocketId = global.onlineUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from });
    }
  });

  // ✅ Stop Typing Event
  socket.on("stop-typing", ({ to, from }) => {
    const receiverSocketId = global.onlineUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", { from });
    }
  });

  // ✅ Send message
  socket.on("send-msg", async ({ to, from, message }) => {
    try {
      const status = global.onlineUsers.has(to) ? "delivered" : "sent";

      const newMessage = await Message.create({
        senderId: from,
        recieverId: to,
        message,
        status,
      });

      const receiverSocketId = global.onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("msg-receive", newMessage);
      }

      const senderSocketId = global.onlineUsers.get(from);
      if (senderSocketId) {
        io.to(senderSocketId).emit("msg-sent", newMessage);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  });

  // ✅ Message seen
  socket.on("message-seen", async ({ messageId }) => {
    try {
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { status: "seen" },
        { new: true }
      );

      const senderSocketId = global.onlineUsers.get(updated.senderId.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("message-seen-update", updated);
      }
    } catch (err) {
      console.error("Seen update error:", err);
    }
  });

  // ✅ Disconnect handling
  socket.on("disconnect", () => {
    for (const [userId, socketId] of global.onlineUsers.entries()) {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
  });
});

module.exports = { app, server };
