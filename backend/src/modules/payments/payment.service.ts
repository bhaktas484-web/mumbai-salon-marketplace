import Razorpay from "razorpay";
import crypto   from "crypto";
import { Booking } from "../bookings/booking.model";
import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

/* ── Razorpay client ─────────────────────────────────── */
const razorpay = new Razorpay({
  key_id:     env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

/* ── Create Razorpay order ───────────────────────────── */
export async function createPaymentOrder(bookingId: string, userId: string) {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) throw AppError.notFound("Booking");
  if (booking.payment.status === "paid") throw AppError.conflict("Booking already paid");

  /* Amount in paise (INR × 100) */
  const order = await razorpay.orders.create({
    amount:   booking.total * 100,
    currency: "INR",
    receipt:  booking.bookingNumber,
    notes:    {
      bookingId:     String(booking._id),
      bookingNumber: booking.bookingNumber,
      salonName:     booking.salonName,
    },
  });

  /* Save order ID to booking */
  booking.payment.razorpayOrderId = order.id;
  await booking.save({ validateBeforeSave: false });

  return {
    orderId:       order.id,
    amount:        order.amount,
    currency:      order.currency,
    bookingNumber: booking.bookingNumber,
    keyId:         env.RAZORPAY_KEY_ID,
  };
}

/* ── Verify payment signature ────────────────────────── */
export async function verifyPayment(dto: {
  razorpayOrderId:   string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  /* 1. Verify HMAC signature */
  const body      = `${dto.razorpayOrderId}|${dto.razorpayPaymentId}`;
  const expected  = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== dto.razorpaySignature) {
    throw AppError.badRequest("Invalid payment signature");
  }

  /* 2. Find booking by order ID */
  const booking = await Booking.findOne({
    "payment.razorpayOrderId": dto.razorpayOrderId,
  });
  if (!booking) throw AppError.notFound("Booking for this payment");

  /* 3. Update booking to paid + confirmed */
  booking.payment.razorpayPaymentId = dto.razorpayPaymentId;
  booking.payment.status            = "paid";
  booking.payment.paidAt            = new Date();
  booking.status                    = "confirmed";
  await booking.save({ validateBeforeSave: false });

  logger.info(`Payment verified for booking ${booking.bookingNumber}`);
  return booking;
}

/* ── Webhook handler ─────────────────────────────────── */
export async function handleWebhook(body: string, signature: string) {
  /* Verify webhook signature */
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    throw AppError.unauthorized("Invalid webhook signature");
  }

  const event = JSON.parse(body) as {
    event: string;
    payload: {
      payment?: { entity: { order_id: string; id: string; status: string } };
    };
  };

  logger.info(`Razorpay webhook: ${event.event}`);

  if (event.event === "payment.captured") {
    const { order_id, id } = event.payload.payment!.entity;
    await Booking.findOneAndUpdate(
      { "payment.razorpayOrderId": order_id },
      {
        "payment.razorpayPaymentId": id,
        "payment.status":            "paid",
        "payment.paidAt":            new Date(),
        status:                      "confirmed",
      }
    );
  }

  if (event.event === "payment.failed") {
    const { order_id } = event.payload.payment!.entity;
    await Booking.findOneAndUpdate(
      { "payment.razorpayOrderId": order_id },
      { "payment.status": "failed", status: "cancelled" }
    );
  }
}

/* ── Initiate refund ─────────────────────────────────── */
export async function initiateRefund(bookingId: string) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw AppError.notFound("Booking");
  if (booking.payment.status !== "paid") throw AppError.badRequest("Booking is not paid");
  if (!booking.payment.razorpayPaymentId) throw AppError.badRequest("No payment ID found");

  const refund = await razorpay.payments.refund(booking.payment.razorpayPaymentId, {
    amount: booking.total * 100,
    notes:  { reason: "Booking cancellation", bookingId: String(booking._id) },
  });

  booking.payment.status = "refunded";
  booking.status         = "cancelled";
  await booking.save({ validateBeforeSave: false });

  return refund;
}