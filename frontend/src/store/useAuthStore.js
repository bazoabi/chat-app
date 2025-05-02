import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"; // Import socket.io client

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const useAuthStore = create((set, get) => ({
  authUser: null, // authenticated user
  isSigningUp: false, // is signing up
  isLoggingIn: false, // is logging in
  isUpdatingProfile: false, // is updating profile
  isCheckingAuth: true, // is checking authentication status
  onlineUsers: [], // list of online users
  socket: null, // WebSocket connection

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data.user });
      if (response.data.user) {
        get().connectSocket(); // Connect to socket if user is authenticated
      } else {
        set({ onlineUsers: [] }); // Clear online users if not authenticated
      }
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      set({ authUser: response.data.user });
      toast.success("Signup successful! Please login.");
      get().connectSocket(); // Connect to socket after signup
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      console.error("Error in signup:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket(); // Disconnect socket on logout
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
      console.error("Error in logout:", error);
    }
  },

  login: async (userData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      set({ authUser: response.data.user });
      toast.success("Login successful!");
      get().connectSocket(); // Connect to socket after login
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Error in login:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        profileData
      );
      set({ authUser: response.data.user });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Profile update failed. Please try again."
      );
      console.error("Error in updateProfile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) {
      console.error("Cannot connect to socket. User is not authenticated.");
      return;
    }
    // Check if socket is already connected
    const existingSocket = get().socket;
    if (existingSocket) {
      console.log("Socket already connected:", existingSocket.id);
      return;
    }

    const socket = io(BASE_URL, {
      // withCredentials: true,
      // transports: ["websocket"],
      query: {
        userId: authUser._id, // Pass userId as a query parameter
      },
    });

    socket.connect();
    set({ socket });

    // Listen for online users event
    socket.on("getOnlineUsers", (users) => {
      console.log("Online users:", users);
      set({ onlineUsers: users });
    });

    // socket.on("connect", () => {
    //   console.log("Socket connected:", socket.id);
    // });

    // socket.on("disconnect", () => {
    //   console.log("Socket disconnected:", socket.id);
    // });

    // socket.on("onlineUsers", (users) => {
    //   set({ onlineUsers: users });
    // });
  },
  disconnectSocket: () => {
    const socket = get().socket;

    if (!socket) {
      console.error("No socket connection to disconnect.");
      return;
    }

    // Check if the socket is already disconnected
    if (!socket.connected) {
      console.log("Socket already disconnected:", socket.id);
      return;
    }

    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected");
    }
  },
}));
