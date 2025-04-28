// we need to create a store to manage the chat messages
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
  chatMessages: [], // Array to store chat messages
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
      set({ chatMessages: response.data });
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
}));
