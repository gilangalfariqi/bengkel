import { create } from "zustand";
import type { AuthUser } from "@/domain/entities/auth";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (payload: { user: AuthUser; token: string }) => void;
  clearAuth: () => void;
  hydrate: () => void;
};

const STORAGE_KEY = "bengkel_auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,
  setAuth: ({ user, token }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token, access_token: token }));
    set({ user, token, isHydrated: true });
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null, isHydrated: true });
  },
  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        set({ isHydrated: true });
        return;
      }
      const parsed = JSON.parse(raw) as { user: AuthUser; token?: string; access_token?: string };
      const token = parsed.token ?? parsed.access_token ?? null;
      set({ user: parsed.user ?? null, token, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },
}));
