import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User, AuthState, LoginDTO, SignupDTO } from "@/types/user";

interface AuthStore extends AuthState {
  login:   (dto: LoginDTO)  => Promise<void>;
  signup:  (dto: SignupDTO) => Promise<void>;
  logout:  ()               => Promise<void>;
  setUser: (user: User)     => void;
  refresh: ()               => Promise<void>;
}

/* Backend wraps all responses as { success, data: { user, accessToken } } */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
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
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify(dto),
            });
            const json = await res.json() as ApiResponse<{ user: User; accessToken: string }>;
            if (!res.ok || !json.success) throw new Error(json.message ?? "Invalid credentials");
            const { user, accessToken } = json.data!;
            set({ user, accessToken, isAuthenticated: true });
          } finally {
            set({ isLoading: false });
          }
        },

        signup: async (dto) => {
          set({ isLoading: true });
          try {
            const res = await fetch("/api/auth/signup", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify(dto),
            });
            const json = await res.json() as ApiResponse<{ user: User; accessToken: string }>;
            if (!res.ok || !json.success) throw new Error(json.message ?? "Signup failed");
            const { user, accessToken } = json.data!;
            set({ user, accessToken, isAuthenticated: true });
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          try {
            await fetch("/api/auth/logout", { method: "POST" });
          } catch { /* noop */ }
          set({ user: null, accessToken: null, isAuthenticated: false });
        },

        setUser: (user) => set({ user }),

        refresh: async () => {
          try {
            const res  = await fetch("/api/auth/refresh", { method: "POST" });
            const json = await res.json() as ApiResponse<{ accessToken: string }>;
            if (!res.ok || !json.success) {
              set({ user: null, accessToken: null, isAuthenticated: false });
              return;
            }
            set({ accessToken: json.data!.accessToken });
          } catch {
            set({ user: null, accessToken: null, isAuthenticated: false });
          }
        },
      }),
      {
        name: "glamr:auth",
        partialize: (s) => ({
          user:            s.user,
          accessToken:     s.accessToken,
          isAuthenticated: s.isAuthenticated,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);