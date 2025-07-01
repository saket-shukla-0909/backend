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
  console.log(`✅ Socket connected: ${socket.id}`);

  // 🔐 Register user
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    console.log(`👤 User registered: ${userId}`);
  });

  // 💬 Typing events
  socket.on("typing", ({ to, from }) => {
    const receiver = onlineUsers.get(to);
    if (receiver) {
      io.to(receiver).emit("typing", { from });
    }
  });

  socket.on("stop-typing", ({ to, from }) => {
    const receiver = onlineUsers.get(to);
    if (receiver) {
      io.to(receiver).emit("stop-typing", { from });
    }
  });

  // 📩 Message sending
  socket.on("send-msg", async ({ to, from, message }) => {
    try {
      const status = onlineUsers.has(to) ? "delivered" : "sent";

      const newMessage = await Message.create({
        senderId: from,
        recieverId: to,
        message,
        status,
      });

      const receiver = onlineUsers.get(to);
      if (receiver) {
        io.to(receiver).emit("msg-receive", newMessage);
      }

      const sender = onlineUsers.get(from);
      if (sender) {
        io.to(sender).emit("msg-sent", newMessage);
      }
    } catch (err) {
      console.error("💥 Message send error:", err);
    }
  });

  // ✅ Seen message
  socket.on("message-seen", async ({ messageId }) => {
    try {
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { status: "seen" },
        { new: true }
      );

      const sender = onlineUsers.get(updated.senderId.toString());
      if (sender) {
        io.to(sender).emit("message-seen-update", updated);
      }
    } catch (err) {
      console.error("💥 Seen update error:", err);
    }
  });

  // 📞 Call initiated
  socket.on("call-user", ({ to, signalData, from, isVideoCall }) => {
    const receiver = onlineUsers.get(to);
    console.log(`📞 ${from} is calling ${to} - Video: ${isVideoCall}`);
    if (receiver) {
      io.to(receiver).emit("receive-call", {
        signal: signalData,
        from,
        isVideoCall, // ✅ forward video/audio type
      });
    } else {
      console.log(`❌ User ${to} is offline or not connected`);
    }
  });

  // ✅ Call answered
  socket.on("answer-call", ({ to, signal }) => {
    const receiver = onlineUsers.get(to);
    console.log(`✅ ${socket.id} answered call for ${to}`);
    if (receiver) {
      io.to(receiver).emit("call-answered", { signal });
    }
  });

  // ❌ Call ended
  socket.on("end-call", ({ to }) => {
    const receiver = onlineUsers.get(to);
    console.log(`📴 Call ended for ${to}`);
    if (receiver) {
      io.to(receiver).emit("call-ended");
    }
  });

  // 🔌 Handle disconnect
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`🚪 User ${userId} disconnected`);
        break;
      }
    }
  });
});

module.exports = { app, server };
