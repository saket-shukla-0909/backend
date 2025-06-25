const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const express = require("express");

const { app, server } = require("./socketIo");

connectDB();
console.log(process.env.FRONTEND_URL, "this is frontend url in index.js");

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://your-frontend.vercel.app",
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// 👉 Serve frontend (React build)
const frontendBuildPath = path.join(__dirname, "client", "build");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Start Server
server.listen(process.env.SERVER_PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`✅ Server started at PORT: ${process.env.SERVER_PORT}`);
  }
});

// const dotenv = require("dotenv").config();
// const connectDB = require("./config/db");
// const cors = require("cors");
// const path = require("path");

// const express = require("express");
// const { app, server } = require("./socketIo");

// connectDB();
// console.log( process.env.FRONTEND_URL, "this is frontend url in index.js"); 
// app.use(express.json());
// app.use(
//   cors({
//     origin: `${process.env.FRONTEND_URL}`|| "https://frontend-k5pu-ri5hzh10d-saket-shukla-0909s-projects.vercel.app",
//     credentials: true,
//   })
// );

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api/auth", require("./routes/userRoutes"));
// app.use("/api/messages", require("./routes/messageRoutes"));

// server.listen(process.env.SERVER_PORT, (error) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(`✅ Server started at PORT: ${process.env.SERVER_PORT}`);
//   }
// });
