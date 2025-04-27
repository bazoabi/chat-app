import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null, // authenticated user
  isSigningUp: false, // is signing up
  isLoggingIn: false, // is logging in
  isUpdatingProfile: false, // is updating profile

  isCheckingAuth: true, // is checking authentication status

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data.user });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
