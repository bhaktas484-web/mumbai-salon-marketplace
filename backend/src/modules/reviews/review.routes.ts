import { Router } from "express";
import { z } from "zod";
import * as ctrl from "./review.controller";
import { protect, restrictTo } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";

export const reviewRouter = Router();

const createReviewSchema = z.object({
  bookingId:   z.string().regex(/^[a-f\d]{24}$/i),
  rating:      z.number().int().min(1).max(5),
  comment:     z.string().min(10).max(1000),
  serviceUsed: z.string().optional(),
  ratings: z.object({
    cleanliness:   z.number().min(1).max(5),
    service:       z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
    ambiance:      z.number().min(1).max(5),
  }).optional(),
});

/* ── Public ──────────────────────────────────────────── */
reviewRouter.get("/salon/:salonId", ctrl.getSalonReviews);

/* ── Authenticated ───────────────────────────────────── */
reviewRouter.use(protect);
reviewRouter.post("/",               validate(createReviewSchema), ctrl.createReview);
reviewRouter.get( "/me",             ctrl.getMyReviews);
reviewRouter.post("/:reviewId/reply",
  restrictTo("salon_owner","admin"),
  validate(z.object({ text: z.string().min(1).max(500) })),
  ctrl.replyToReview
);
reviewRouter.delete("/:reviewId",    restrictTo("admin"), ctrl.deleteReview);