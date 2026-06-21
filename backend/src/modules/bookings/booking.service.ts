import { Booking } from "./booking.model";
import { Salon }   from "../salons/salon.model";
import { Service } from "../salons/service.model";
import { AppError } from "../../utils/AppError";
import { cache, CacheKey } from "../../config/redis";

const TAX_RATE = 0.18; // 18% GST

/* ── Check slot availability ─────────────────────────── */
export async function checkSlotAvailable(
  salonId: string, date: string, time: string, durationMinutes: number
): Promise<boolean> {
  // End time of new booking
  const [h, m]    = time.split(":").map(Number) as [number, number];
  const endMinutes = h * 60 + m + durationMinutes;
  const endH       = Math.floor(endMinutes / 60);
  const endM       = endMinutes % 60;
  const endTime    = `${String(endH).padStart(2,"0")}:${String(endM).padStart(2,"0")}`;

  const conflict = await Booking.findOne({
    salon:         salonId,
    scheduledDate: date,
    status:        { $in: ["pending","confirmed","in_progress"] },
    $or: [
      { scheduledTime: { $gte: time, $lt: endTime } },
      { endTime:       { $gt: time, $lte: endTime } },
    ],
  });
  return !conflict;
}

/* ── Get available slots for a day ───────────────────── */
export async function getAvailableSlots(salonId: string, date: string) {
  const cacheKey = CacheKey.slots(salonId, date);
  const cached   = await cache.get<string[]>(cacheKey);
  if (cached) return cached;

  const ALL_SLOTS = [
    "09:00","09:30","10:00","10:30","11:00","11:30","12:00",
    "14:00","14:30","15:00","15:30","16:00","17:00","17:30",
    "18:00","18:30","19:00","19:30",
  ];

  const booked = await Booking.find({
    salon:         salonId,
    scheduledDate: date,
    status:        { $in: ["pending","confirmed","in_progress"] },
  }).select("scheduledTime endTime").lean();

  const bookedTimes = new Set(booked.map(b => b.scheduledTime));
  const available   = ALL_SLOTS.filter(s => !bookedTimes.has(s));

  await cache.set(cacheKey, available, 60); // 1 min TTL
  return available;
}

/* ── Create booking ──────────────────────────────────── */
export async function createBooking(dto: {
  userId:        string;
  salonId:       string;
  serviceIds:    string[];
  scheduledDate: string;
  scheduledTime: string;
  notes?:        string;
  couponCode?:   string;
  paymentMethod: string;
}) {
  /* 1. Validate salon */
  const salon = await Salon.findById(dto.salonId).lean();
  if (!salon) throw AppError.notFound("Salon");

  /* 2. Validate services */
  const services = await Service.find({
    _id:    { $in: dto.serviceIds },
    salon:  dto.salonId,
    isActive: true,
  }).lean();
  if (services.length !== dto.serviceIds.length) {
    throw AppError.badRequest("One or more services are invalid");
  }

  /* 3. Calculate totals */
  const items = services.map((s: any) => ({
    service:         s._id,
    serviceName:     s.name,
    price:           s.discountedPrice ?? s.price,
    durationMinutes: s.durationMinutes,
  }));

  const totalDuration = items.reduce((sum, i) => sum + i.durationMinutes, 0);
  const subtotal      = items.reduce((sum, i) => sum + i.price, 0);

  /* 4. Coupon discount (simple 10% if code = GLAMR10) */
  let discountAmount = 0;
  if (dto.couponCode === "GLAMR10") {
    discountAmount = Math.round(subtotal * 0.1);
  }

  const taxable   = subtotal - discountAmount;
  const taxAmount = Math.round(taxable * TAX_RATE);
  const total     = taxable + taxAmount;

  /* 5. Calculate end time */
  const [h, m]    = dto.scheduledTime.split(":").map(Number) as [number, number];
  const endMinutes = h * 60 + m + totalDuration;
  const endTime    = `${String(Math.floor(endMinutes/60)).padStart(2,"0")}:${String(endMinutes%60).padStart(2,"0")}`;

  /* 6. Check slot */
  const available = await checkSlotAvailable(dto.salonId, dto.scheduledDate, dto.scheduledTime, totalDuration);
  if (!available) throw AppError.conflict("Selected time slot is no longer available");

  /* 7. Create booking */
  const booking = await Booking.create({
    user:          dto.userId,
    salon:         dto.salonId,
    salonName:     salon.name,
    salonAddress:  salon.location.address,
    items,
    scheduledDate: dto.scheduledDate,
    scheduledTime: dto.scheduledTime,
    endTime,
    totalDurationMinutes: totalDuration,
    subtotal,
    discountAmount,
    couponCode:    dto.couponCode,
    taxAmount,
    total,
    status:        "pending",
    payment:       { amount: total, status: "unpaid" },
    notes:         dto.notes,
  });

  /* 8. Increment salon booking count */
  await Salon.findByIdAndUpdate(dto.salonId, { $inc: { totalBookings: 1 } });

  /* 9. Invalidate slots cache */
  await cache.del(CacheKey.slots(dto.salonId, dto.scheduledDate));

  return booking;
}

/* ── Get my bookings ─────────────────────────────────── */
export async function getMyBookings(userId: string, status?: string) {
  const filter: Record<string, unknown> = { user: userId };
  if (status) filter["status"] = status;

  return Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate("salon", "name location.area coverImage")
    .lean();
}

/* ── Get booking by ID ───────────────────────────────── */
export async function getBookingById(bookingId: string, userId: string) {
  const booking = await Booking.findOne({ _id: bookingId, user: userId })
    .populate("salon", "name location phone")
    .lean();
  if (!booking) throw AppError.notFound("Booking");
  return booking;
}

/* ── Cancel booking ──────────────────────────────────── */
export async function cancelBooking(bookingId: string, userId: string, reason: string) {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) throw AppError.notFound("Booking");

  if (!["pending","confirmed"].includes(booking.status)) {
    throw AppError.badRequest("This booking cannot be cancelled");
  }

  booking.status       = "cancelled";
  booking.cancelReason = reason;
  booking.cancelledBy  = "customer";
  await booking.save();

  // Restore slot availability
  await cache.del(CacheKey.slots(String(booking.salon), booking.scheduledDate));
  return booking;
}

/* ── Salon owner: get bookings ───────────────────────── */
export async function getSalonBookings(salonId: string, date?: string, status?: string) {
  const filter: Record<string, unknown> = { salon: salonId };
  if (date)   filter["scheduledDate"] = date;
  if (status) filter["status"]        = status;

  return Booking.find(filter)
    .sort({ scheduledDate: 1, scheduledTime: 1 })
    .populate("user", "name phone email")
    .lean();
}

/* ── Update booking status (salon owner) ─────────────── */
export async function updateBookingStatus(
  bookingId: string,
  status:    IBooking["status"],
  salonId:   string
) {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, salon: salonId },
    { $set: { status } },
    { new: true }
  );
  if (!booking) throw AppError.notFound("Booking");
  return booking;
}

// Type import fix
type IBooking = import("./booking.model").IBooking;