"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  points: number;
  currentPhase: number;
  completedLessons: string[];
  completedModules: string[];
  certificates: string[];
  joinedAt: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  showLoginModal: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// Mock user for demo
const mockUser: User = {
  id: "user-1",
  email: "demo@playstack.dev",
  displayName: "Demo User",
  avatar: "🧑‍💻",
  points: 150,
  currentPhase: 2,
  completedLessons: ["lesson-1-1-1", "lesson-1-1-2", "lesson-1-1-3"],
  completedModules: ["module-1-1"],
  certificates: ["cert-foundation"],
  joinedAt: "2024-12-01",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      showLoginModal: false,

      login: async (email: string, password: string) => {
        // Mock login - in production, call API
        if (email && password) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          set({
            user: { ...mockUser, email, displayName: email.split("@")[0] },
            isLoggedIn: true,
            showLoginModal: false,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      openLoginModal: () => set({ showLoginModal: true }),
      closeLoginModal: () => set({ showLoginModal: false }),
    }),
    {
      name: "play-stack-auth",
    }
  )
);
