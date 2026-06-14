import type { Service, Stylist } from "./salon";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "refunded"
  | "failed";

export type PaymentMethod =
  | "upi"
  | "card"
  | "net_banking"
  | "wallet"
  | "cash"
  | "pay_later";

/* ── Time Slot ────────────────────────────────────────────── */

export interface TimeSlot {
  id: string;
  startTime: string;  // "10:00"
  endTime: string;    // "11:30"
  isAvailable: boolean;
  stylistId?: string;
}

export interface DayAvailability {
  date: string;        // "2024-02-15"
  slots: TimeSlot[];
  isHoliday: boolean;
  holidayName?: string;
}

/* ── Booking Item ─────────────────────────────────────────── */

export interface BookingItem {
  serviceId: string;
  service: Service;
  stylistId?: string;
  stylist?: Stylist;
  price: number;
  durationMinutes: number;
}

/* ── Payment ──────────────────────────────────────────────── */

export interface Payment {
  id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;       // INR paise
  currency: "INR";
  method?: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

/* ── Main Booking ─────────────────────────────────────────── */

export interface Booking {
  id: string;
  bookingNumber: string;   // "GLM-2402-1234" — human readable
  userId: string;
  salonId: string;
  salonName: string;
  salonAddress: string;
  items: BookingItem[];
  scheduledDate: string;   // "2024-02-15"
  scheduledTime: string;   // "10:00"
  endTime: string;         // "11:30"
  totalDurationMinutes: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  total: number;
  status: BookingStatus;
  payment: Payment;
  notes?: string;          // Customer notes for salon
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Booking Flow State ───────────────────────────────────── */

export interface BookingDraft {
  salonId: string;
  salonSlug: string;
  salonName: string;
  selectedServices: BookingItem[];
  selectedDate?: string;
  selectedSlot?: TimeSlot;
  notes?: string;
  couponCode?: string;
  step: "services" | "datetime" | "confirm" | "payment";
}

/* ── Create Booking DTO ───────────────────────────────────── */

export interface CreateBookingDTO {
  salonId: string;
  items: Array<{
    serviceId: string;
    stylistId?: string;
  }>;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
}