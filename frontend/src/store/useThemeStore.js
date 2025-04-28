import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee", // Default theme is light
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme); // Save the theme to local storage
    set({ theme }); // Update the theme in the store
  },
}));
