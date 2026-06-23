// apps/web/src/lib/auth.ts
import { useAuthStore } from "@/store/authStore";

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}