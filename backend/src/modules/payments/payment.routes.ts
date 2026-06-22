import { Router } from "express";
import { z } from "zod";
import * as ctrl from "./payment.controller";
import { protect, restrictTo } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";

export const paymentRouter = Router();

/* ── Webhook (no auth — Razorpay calls this) ─────────── */
paymentRouter.post("/webhook", ctrl.handleWebhook);

/* ── Authenticated ───────────────────────────────────── */
paymentRouter.use(protect);

paymentRouter.post(
  "/create-order",
  validate(z.object({ bookingId: z.string().regex(/^[a-f\d]{24}$/i) })),
  ctrl.createPaymentOrder
);

paymentRouter.post(
  "/verify",
  validate(z.object({
    razorpayOrderId:   z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string(),
  })),
  ctrl.verifyPayment
);

paymentRouter.post(
  "/refund/:bookingId",
  restrictTo("admin","salon_owner"),
  ctrl.initiateRefund
);