import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Get the logged-in user's ID from the request
    const users = await User.find({ _id: { $ne: loggedInUserId } }) // Exclude the logged-in user
      .select("-password") // Exclude the password field
      .limit(10); // Limit to 10 users

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Get the ID from the request parameters
    const myId = req.user._id; // Get the logged-in user's ID from the request
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params; // Get the ID from the request parameters
    const senderId = req.user._id; // Get the logged-in user's ID from the request
    const { text, image } = req.body; // Get the message content from the request body

    let imageUrl = null; // Initialize imageUrl to null
    if (image) {
      // If an image is provided, upload it to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(image);
      imageUrl = cloudinaryResponse.secure_url; // Get the secure URL of the uploaded image
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Use the uploaded image URL
    });

    await newMessage.save(); // Save the message to the database

    // TODO: realtime functionality (e.g., socket.io) goes here

    res.status(201).json(newMessage); // Respond with the created message
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
