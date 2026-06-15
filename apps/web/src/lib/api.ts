import type { Salon, SalonListing, PaginatedSalons, SalonFilters } from "@/types/salon";
import type { Booking, CreateBookingDTO, DayAvailability } from "@/types/booking";
import type { AuthResponse, LoginDTO, SignupDTO, User } from "@/types/user";

/* ── Base fetch wrapper ───────────────────────────────────── */

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };

  const res = await fetch(`/api${path}`, { headers, ...rest });

  if (!res.ok) {
    let message = `API ${res.status}`;
    try { message = ((await res.json()) as { message?: string }).message ?? message; } catch { /* noop */ }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/* ── Auth API ─────────────────────────────────────────────── */

export const authApi = {
  login:   (dto: LoginDTO)  => apiFetch<AuthResponse>("/auth/login",  { method: "POST", body: JSON.stringify(dto) }),
  signup:  (dto: SignupDTO) => apiFetch<AuthResponse>("/auth/signup", { method: "POST", body: JSON.stringify(dto) }),
  logout:  ()               => apiFetch<void>("/auth/logout", { method: "POST" }),
  refresh: ()               => apiFetch<{ accessToken: string }>("/auth/refresh", { method: "POST" }),
  me:      (token: string)  => apiFetch<User>("/auth/me", { token }),
};

/* ── Salon API ────────────────────────────────────────────── */

function filtersToQuery(filters: SalonFilters): string {
  const p = new URLSearchParams();
  if (filters.area?.length)     filters.area.forEach((a) => p.append("area", a));
  if (filters.category?.length) filters.category.forEach((c) => p.append("category", c));
  if (filters.gender)           p.set("gender", filters.gender);
  if (filters.tier?.length)     filters.tier.forEach((t) => p.append("tier", t));
  if (filters.minRating)        p.set("minRating", String(filters.minRating));
  if (filters.maxPrice)         p.set("maxPrice", String(filters.maxPrice));
  if (filters.isOpen)           p.set("isOpen", "true");
  if (filters.sortBy)           p.set("sortBy", filters.sortBy);
  return p.toString();
}

export const salonApi = {
  list: (filters: SalonFilters = {}, page = 1, pageSize = 12) => {
    const qs = filtersToQuery(filters);
    return apiFetch<PaginatedSalons>(`/salons?page=${page}&pageSize=${pageSize}&${qs}`);
  },

  getBySlug: (slug: string) =>
    apiFetch<Salon>(`/salons/${slug}`),

  getFeatured: () =>
    apiFetch<SalonListing[]>("/salons/featured"),

  getTrending: (area?: string) =>
    apiFetch<SalonListing[]>(`/salons/trending${area ? `?area=${area}` : ""}`),

  getAvailability: (salonId: string, from: string, to: string) =>
    apiFetch<DayAvailability[]>(`/salons/${salonId}/availability?from=${from}&to=${to}`),
};

/* ── Booking API ──────────────────────────────────────────── */

export const bookingApi = {
  create: (dto: CreateBookingDTO, token: string) =>
    apiFetch<Booking>("/bookings", { method: "POST", body: JSON.stringify(dto), token }),

  getMyBookings: (token: string, status?: string) =>
    apiFetch<Booking[]>(`/bookings/me${status ? `?status=${status}` : ""}`, { token }),

  getById: (id: string, token: string) =>
    apiFetch<Booking>(`/bookings/${id}`, { token }),

  cancel: (id: string, reason: string, token: string) =>
    apiFetch<Booking>(`/bookings/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
      token,
    }),

  validateCoupon: (code: string, salonId: string) =>
    apiFetch<{ valid: boolean; discountPct?: number; maxDiscount?: number }>(
      `/coupons/validate?code=${code}&salonId=${salonId}`
    ),
};

export { ApiError };