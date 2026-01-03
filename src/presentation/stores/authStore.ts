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
  plan: "free" | "pro" | "team";
  planExpiresAt?: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isPremium: boolean;
  showLoginModal: boolean;
  showPaywallModal: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openPaywallModal: () => void;
  closePaywallModal: () => void;
  upgradeToPro: () => void;
  canAccessPhase: (phaseNumber: number) => boolean;
  canAccessLesson: (lessonId: string) => boolean;
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
  plan: "free",
};

// Free tier: Phase 1 only
// Pro tier: All phases
const FREE_PHASES = [1];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isPremium: false,
      showLoginModal: false,
      showPaywallModal: false,

      login: async (email: string, password: string) => {
        if (email && password) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set({
            user: { ...mockUser, email, displayName: email.split("@")[0] },
            isLoggedIn: true,
            isPremium: false,
            showLoginModal: false,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isLoggedIn: false, isPremium: false });
      },

      openLoginModal: () => set({ showLoginModal: true }),
      closeLoginModal: () => set({ showLoginModal: false }),
      
      openPaywallModal: () => set({ showPaywallModal: true }),
      closePaywallModal: () => set({ showPaywallModal: false }),

      // Mock upgrade - in production, this happens after Stripe payment
      upgradeToPro: () => {
        const user = get().user;
        if (user) {
          set({
            user: { ...user, plan: "pro" },
            isPremium: true,
            showPaywallModal: false,
          });
        }
      },

      canAccessPhase: (phaseNumber: number) => {
        const { isPremium } = get();
        if (isPremium) return true;
        return FREE_PHASES.includes(phaseNumber);
      },

      canAccessLesson: (lessonId: string) => {
        const { isPremium } = get();
        if (isPremium) return true;
        
        // Extract phase number from lesson ID (e.g., "lesson-2-1-1" -> 2)
        const match = lessonId.match(/lesson-(\d+)-/);
        if (!match) return true;
        
        const phaseNumber = parseInt(match[1], 10);
        return FREE_PHASES.includes(phaseNumber);
      },
    }),
    {
      name: "play-stack-auth",
    }
  )
);
