import type { MumbaiArea } from "./salon";
import type { Booking } from "./booking";

export type UserRole = "customer" | "salon_owner" | "admin";

export type AuthProvider = "email" | "google" | "phone";

/* ── Address ──────────────────────────────────────────────── */

export interface SavedAddress {
  id: string;
  label: string;        // "Home", "Office"
  area: MumbaiArea;
  fullAddress: string;
  pincode: string;
  isDefault: boolean;
}

/* ── Preferences ──────────────────────────────────────────── */

export interface UserPreferences {
  preferredAreas: MumbaiArea[];
  preferredGender: "Women" | "Men" | "Unisex" | null;
  notificationsEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  reminderMinutes: 15 | 30 | 60 | 120;
}

/* ── Main User ────────────────────────────────────────────── */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  authProvider: AuthProvider;
  preferences: UserPreferences;
  savedAddresses: SavedAddress[];
  loyaltyPoints: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

/* ── Auth ─────────────────────────────────────────────────── */

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface SignupDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: "customer" | "salon_owner";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/* ── Customer Profile (extended) ──────────────────────────── */

export interface CustomerProfile extends User {
  recentBookings: Booking[];
  favouriteSalons: string[];      // salon IDs
  pendingReviews: string[];        // booking IDs awaiting review
}