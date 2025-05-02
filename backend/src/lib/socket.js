import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Return the socket ID for the given user ID
}

// Map to store online user IDs and their corresponding socket IDs
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  const userId = socket.handshake.query.userId; // Get userId from the query parameters

  if (userId) {
    userSocketMap[userId] = socket.id; // Store the socket ID for the user
    console.log("User connected:", userId, "Socket ID:", socket.id);
  }

  // Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the list of online users to all clients

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Remove the user from the map when they disconnect
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId]; // Remove the user from the map
        console.log("User disconnected:", userId, "Socket ID:", socket.id);
        break; // Exit the loop once the user is found and removed
      }
    }
    // Emit the updated list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated list of online users to all clients
  });

  socket.on("message", (data) => {
    console.log("Message received:", data);
    // Broadcast the message to all connected clients
    io.emit("message", data);
  });
});

export { app, io, server };
