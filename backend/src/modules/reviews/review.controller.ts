import type { Request, Response, NextFunction } from "express";
import * as reviewService from "./review.service";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/apiResponse";

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await reviewService.createReview({
      userId: req.user!.id,
      ...(req.body as object),
    } as Parameters<typeof reviewService.createReview>[0]);
    sendCreated(res, { review }, "Review submitted successfully");
  } catch (err) { next(err); }
}

export async function getSalonReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, pageSize, sortBy } = req.query as Record<string, string>;
    const salonId = Array.isArray(req.params["salonId"])
      ? req.params["salonId"][0]
      : req.params["salonId"];
    const result = await reviewService.getSalonReviews(
      salonId!,
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 10,
      sortBy
    );
    sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getMyReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await reviewService.getMyReviews(req.user!.id);
    sendSuccess(res, { reviews });
  } catch (err) { next(err); }
}

export async function replyToReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { text } = req.body as { text: string };
    const reviewId = Array.isArray(req.params["reviewId"])
      ? req.params["reviewId"][0]
      : req.params["reviewId"];
    if (!reviewId) throw new Error("Review ID is required");
    const review = await reviewService.replyToReview(reviewId, text, req.user!.id);
    sendSuccess(res, { review }, "Reply posted");
  } catch (err) { next(err); }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    const reviewId = Array.isArray(req.params["reviewId"]) ? req.params["reviewId"][0] : req.params["reviewId"];
    if (!reviewId) throw new Error("Review ID is required");
    await reviewService.deleteReview(reviewId);
    sendNoContent(res);
  } catch (err) { next(err); }
}