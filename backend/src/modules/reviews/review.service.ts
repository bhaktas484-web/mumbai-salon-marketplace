import { Review } from "./review.model";
import { Booking } from "../bookings/booking.model";
import { AppError } from "../../utils/AppError";
import { cache, CacheKey } from "../../config/redis";

/* ── Create review ───────────────────────────────────── */
export async function createReview(dto: {
  userId:    string;
  bookingId: string;
  rating:    number;
  comment:   string;
  serviceUsed?: string;
  ratings?: {
    cleanliness:   number;
    service:       number;
    valueForMoney: number;
    ambiance:      number;
  };
}) {
  /* 1. Verify booking belongs to user and is completed */
  const booking = await Booking.findOne({
    _id:    dto.bookingId,
    user:   dto.userId,
    status: "completed",
  });
  if (!booking) throw AppError.badRequest("Can only review completed bookings");

  /* 2. Check no duplicate review */
  const existing = await Review.findOne({ booking: dto.bookingId });
  if (existing) throw AppError.conflict("You have already reviewed this booking");

  /* 3. Create */
  const review = await Review.create({
    user:        dto.userId,
    salon:       booking.salon,
    booking:     dto.bookingId,
    rating:      dto.rating,
    comment:     dto.comment,
    serviceUsed: dto.serviceUsed,
    ratings:     dto.ratings,
    isVerified:  true,
  });

  /* 4. Bust salon cache */
  await cache.del(CacheKey.salon("*"));
  return review;
}

/* ── Get reviews for a salon ─────────────────────────── */
export async function getSalonReviews(
  salonId:  string,
  page      = 1,
  pageSize  = 10,
  sortBy    = "newest"
) {
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest:  { createdAt: -1 },
    highest: { rating: -1 },
    lowest:  { rating: 1 },
  };
  const sort: Record<string, 1 | -1> = sortMap[sortBy] ?? sortMap["newest"]!;
  const skip  = (page - 1) * pageSize;

  const [reviews, total] = await Promise.all([
    Review.find({ salon: salonId })
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate("user", "name avatar")
      .lean(),
    Review.countDocuments({ salon: salonId }),
  ]);

  return { reviews, total, page, pageSize, hasMore: skip + reviews.length < total };
}

/* ── Get my reviews ──────────────────────────────────── */
export async function getMyReviews(userId: string) {
  return Review.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("salon", "name coverImage location.area")
    .lean();
}

/* ── Owner reply ─────────────────────────────────────── */
export async function replyToReview(reviewId: string, text: string, salonOwnerId: string) {
  const review = await Review.findById(reviewId).populate("salon", "owner");
  if (!review) throw AppError.notFound("Review");

  const salonDoc = review.salon as unknown as { owner: { toString(): string } };
  if (salonDoc.owner.toString() !== salonOwnerId) {
    throw AppError.forbidden("You can only reply to reviews on your own salon");
  }

  review.ownerReply = { text, repliedAt: new Date() };
  await review.save();
  return review;
}

/* ── Delete review (admin) ───────────────────────────── */
export async function deleteReview(reviewId: string) {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) throw AppError.notFound("Review");
}