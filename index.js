const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const express = require("express");
const { app, server } = require("./socketIo");

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

server.listen(process.env.SERVER_PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`✅ Server started at PORT: ${process.env.SERVER_PORT}`);
  }
});
