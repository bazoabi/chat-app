// we need to create a store to manage the chat messages
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [], // Array to store chat messages
  users: [], // Array to store users
  selectedUser: null, // Currently selected user for chat
  isUsersLoading: false, // Loading state for fetching users
  isMessagesLoading: false, // Loading state for fetching messages

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/message/users");
      set({ users: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users. Please try again."
      );
      console.error("Error in getUsers:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch messages. Please try again."
      );
      console.error("Error in getMessages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return; // No user selected, exit early
    const socket = useAuthStore.getState().socket; // Get the socket from the auth store
    if (!socket) return; // No socket connection, exit early
    socket.on("newMessage", (data) => {
      if (data.senderId === selectedUser._id) {
        // set((state) => ({ messages: [...state.messages, data] }));
        set({ messages: [...get().messages, data] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket; // Get the socket from the auth store
    if (!socket) return; // No socket connection, exit early
    socket.off("newMessage"); // Unsubscribe from the newMessage event
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
}));
