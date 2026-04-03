import { logout } from "@/services/auth";
import { AuthData, User } from "@/types";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  authError: string | null;
  setUser: (user: User) => void;
  logout: () => Promise<AuthData | { error: string }>;
  setAuthError: (error: string) => void;
  clearAuthError: () => void;
}

export const useAuth = create<UserStore>((set) => ({
  user: null,
  authError: null,
  // Fixed: Changed 'user: any' to 'user: User' to resolve Line 17 error
  setUser: (user: User) => set({ user }),
  logout: async () => {
    const result = await logout();

    // Clear user from store after logout
    set({ user: null });

    return result;
  },
  setAuthError: (error: string) => set({ authError: error }),
  clearAuthError: () => set({ authError: null }),
}));
