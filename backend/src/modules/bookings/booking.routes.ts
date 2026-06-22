import { Router } from "express";
import { z } from "zod";
import * as ctrl from "./booking.controller";
import { protect, restrictTo } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { bookingLimiter } from "../../middleware/rateLimiter";

export const bookingRouter = Router();

/* ── All booking routes require authentication ───────── */
bookingRouter.use(protect);

/* ── Validation schemas ──────────────────────────────── */
const createBookingSchema = z.object({
  salonId:       z.string().regex(/^[a-f\d]{24}$/i, "Invalid salon ID"),
  serviceIds:    z.array(z.string().regex(/^[a-f\d]{24}$/i)).min(1, "At least one service required"),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  paymentMethod: z.enum(["razorpay", "cash"]).default("razorpay"),
  notes:         z.string().max(500).optional(),
  couponCode:    z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["confirmed", "in_progress", "completed", "cancelled", "no_show"]),
});

/* ── Customer routes ─────────────────────────────────── */

// Create a new booking
bookingRouter.post(
  "/",
  bookingLimiter,
  validate(createBookingSchema),
  ctrl.createBooking
);

// Get current user's bookings
bookingRouter.get("/my", ctrl.getMyBookings);

// Get a specific booking by ID
bookingRouter.get("/:id", ctrl.getBookingById);

// Cancel a booking
bookingRouter.patch(
  "/:id/cancel",
  validate(z.object({ reason: z.string().max(500).optional() })),
  ctrl.cancelBooking
);

// Get available time slots for a salon on a date
bookingRouter.get("/slots/:salonId/:date", ctrl.getAvailableSlots);

/* ── Salon owner / admin routes ──────────────────────── */

// Get all bookings for a salon
bookingRouter.get(
  "/salon/:salonId",
  restrictTo("salon_owner", "admin"),
  ctrl.getSalonBookings
);

// Update booking status (confirm, complete, etc.)
bookingRouter.patch(
  "/salon/:salonId/:id/status",
  restrictTo("salon_owner", "admin"),
  validate(updateStatusSchema),
  ctrl.updateBookingStatus
);