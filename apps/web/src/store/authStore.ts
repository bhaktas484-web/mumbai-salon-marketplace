import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User, AuthState, LoginDTO, SignupDTO } from "@/types/user";

interface AuthStore extends AuthState {
  login:     (dto: LoginDTO)   => Promise<void>;
  signup:    (dto: SignupDTO)  => Promise<void>;
  logout:    ()                => Promise<void>;
  setUser:   (user: User)      => void;
  refresh:   ()                => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user:            null,
        isAuthenticated: false,
        isLoading:       false,
        accessToken:     null,

        login: async (dto) => {
          set({ isLoading: true });
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error("Invalid credentials");
            const data = (await res.json()) as { user: User; accessToken: string };
            set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true });
          } finally {
            set({ isLoading: false });
          }
        },

        signup: async (dto) => {
          set({ isLoading: true });
          try {
            const res = await fetch("/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error("Signup failed");
            const data = (await res.json()) as { user: User; accessToken: string };
            set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true });
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          set({ user: null, accessToken: null, isAuthenticated: false });
        },

        setUser: (user) => set({ user }),

        refresh: async () => {
          try {
            const res = await fetch("/api/auth/refresh", { method: "POST" });
            if (!res.ok) { set({ user: null, accessToken: null, isAuthenticated: false }); return; }
            const data = (await res.json()) as { accessToken: string };
            set({ accessToken: data.accessToken });
          } catch {
            set({ user: null, accessToken: null, isAuthenticated: false });
          }
        },
      }),
      {
        name: "glamr:auth",
        partialize: (s) => ({ user: s.user, accessToken: s.accessToken, isAuthenticated: s.isAuthenticated }),
      }
    ),
    { name: "AuthStore" }
  )
);