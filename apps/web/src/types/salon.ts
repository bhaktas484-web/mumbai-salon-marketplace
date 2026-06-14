export type MumbaiArea =
  | "Bandra"
  | "Juhu"
  | "Andheri"
  | "Colaba"
  | "Worli"
  | "Lower Parel"
  | "Powai"
  | "Malad"
  | "Borivali"
  | "Thane"
  | "Navi Mumbai"
  | "Dadar"
  | "Chembur"
  | "Kurla"
  | "Santacruz";

export type ServiceCategory =
  | "Hair"
  | "Skin"
  | "Nails"
  | "Makeup"
  | "Spa & Massage"
  | "Threading & Waxing"
  | "Beard & Grooming"
  | "Bridal";

export type SalonTier = "Standard" | "Premium" | "Luxury";

export type Gender = "Women" | "Men" | "Unisex";

/* ── Nested Types ─────────────────────────────────────────── */

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  area: MumbaiArea;
  pincode: string;
}

export interface WorkingHours {
  open: string;   // "09:00"
  close: string;  // "21:00"
  isClosed: boolean;
}

export interface WeeklySchedule {
  monday:    WorkingHours;
  tuesday:   WorkingHours;
  wednesday: WorkingHours;
  thursday:  WorkingHours;
  friday:    WorkingHours;
  saturday:  WorkingHours;
  sunday:    WorkingHours;
}

export interface SalonImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  width?: number;
  height?: number;
}

export interface Stylist {
  id: string;
  name: string;
  avatar?: string;
  specialties: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
}

/* ── Service ──────────────────────────────────────────────── */

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;           // INR
  discountedPrice?: number;
  isPopular?: boolean;
  gender: Gender;
}

export interface ServiceGroup {
  category: ServiceCategory;
  services: Service[];
}

/* ── Review ───────────────────────────────────────────────── */

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;        // 1–5
  comment: string;
  images?: string[];
  serviceUsed?: string;
  createdAt: string;     // ISO date
  isVerified: boolean;
}

export interface RatingBreakdown {
  overall: number;
  cleanliness: number;
  service: number;
  valueForMoney: number;
  ambiance: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

/* ── Main Salon ───────────────────────────────────────────── */

export interface Salon {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  tier: SalonTier;
  gender: Gender;
  location: GeoLocation;
  images: SalonImage[];
  coverImage: string;
  logoUrl?: string;
  phone: string;
  email?: string;
  website?: string;
  instagramHandle?: string;
  workingHours: WeeklySchedule;
  serviceGroups: ServiceGroup[];
  stylists: Stylist[];
  rating: RatingBreakdown;
  amenities: string[];    // ["Parking", "AC", "WiFi", "Card Payment"]
  tags: string[];         // ["Trending", "New", "Top Rated", "Bridal Specialist"]
  isVerified: boolean;
  isOpen: boolean;
  nextAvailableSlot?: string; // ISO datetime
  createdAt: string;
  updatedAt: string;
}

/* ── Listing (card view — subset of full Salon) ───────────── */

export interface SalonListing {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  tier: SalonTier;
  gender: Gender;
  coverImage: string;
  location: Pick<GeoLocation, "area" | "address" | "landmark">;
  rating: Pick<RatingBreakdown, "overall" | "totalReviews">;
  startingPrice: number;   // Lowest service price
  tags: string[];
  isVerified: boolean;
  isOpen: boolean;
  distanceKm?: number;     // From user's location if available
}

/* ── Filters ──────────────────────────────────────────────── */

export interface SalonFilters {
  area?: MumbaiArea[];
  category?: ServiceCategory[];
  gender?: Gender;
  tier?: SalonTier[];
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  isOpen?: boolean;
  amenities?: string[];
  sortBy?: "rating" | "price_asc" | "price_desc" | "distance" | "newest";
}

export interface PaginatedSalons {
  salons: SalonListing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}