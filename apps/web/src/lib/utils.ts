import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
 
/* ── Class name helper ────────────────────────────────────── */
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
 
/* ── Currency ─────────────────────────────────────────────── */
 
export function formatINR(amount: number, compact = false): string {
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
 
export function formatDiscount(original: number, discounted: number): string {
  const pct = Math.round(((original - discounted) / original) * 100);
  return `${pct}% off`;
}
 
/* ── Duration ─────────────────────────────────────────────── */
 
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}
 
/* ── Date & Time ──────────────────────────────────────────── */
 
export function formatBookingDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date))    return `Today, ${format(date, "d MMM")}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, "d MMM")}`;
  return format(date, "EEE, d MMM yyyy");
}
 
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (h === undefined || m === undefined) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
 
export function getTimeRange(start: string, durationMinutes: number): string {
  const [h, m] = start.split(":").map(Number);
  if (h === undefined || m === undefined) return start;
  const endMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(endMinutes / 60) % 24;
  const endM = endMinutes % 60;
  const endStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  return `${formatTime(start)} – ${formatTime(endStr)}`;
}
 
/* ── Rating ───────────────────────────────────────────────── */
 
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
 
export function getRatingLabel(rating: number): string {
  if (rating >= 4.8) return "Exceptional";
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3.0) return "Average";
  return "Below Average";
}
 
/* ── Slug ─────────────────────────────────────────────────── */
 
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}
 
/* ── String ───────────────────────────────────────────────── */
 
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trimEnd()}…`;
}
 
export function pluralize(count: number, word: string, plural?: string): string {
  return count === 1 ? `${count} ${word}` : `${count} ${plural ?? word + "s"}`;
}
 
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
 
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
 
/* ── Distance ─────────────────────────────────────────────── */
 
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  return `${km.toFixed(1)} km away`;
}
 
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
 
/* ── URL ──────────────────────────────────────────────────── */
 
export function buildSalonUrl(slug: string): string {
  return `/salon/${slug}`;
}
 
export function buildBookingUrl(slug: string): string {
  return `/salon/${slug}/book`;
}
 
export function buildSearchUrl(params: Record<string, string | string[]>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.set(key, value);
    }
  }
  return `/explore?${searchParams.toString()}`;
}
 
/* ── Local storage (safe) ─────────────────────────────────── */
 
export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked — fail silently
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Fail silently
    }
  },
};
 
/* ── Device ───────────────────────────────────────────────── */
 
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}
 
export function getGeolocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { timeout: 8000, maximumAge: 300_000 }
    );
  });
}