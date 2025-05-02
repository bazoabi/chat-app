import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js"; // Import the socket.io instance

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve(); // Get the current directory name

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enable CORS with credentials

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static files from the frontend build directory
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); // Serve the index.html file for all other routes
  });
}

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  connectDB();
});
