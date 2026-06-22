import type { Request, Response, NextFunction } from "express";
import * as paymentService from "./payment.service";
import { sendSuccess } from "../../utils/apiResponse";

export async function createPaymentOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await paymentService.createPaymentOrder(
      (req.body as { bookingId: string }).bookingId,
      req.user!.id
    );
    sendSuccess(res, { order }, "Payment order created");
  } catch (err) { next(err); }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await paymentService.verifyPayment(
      req.body as Parameters<typeof paymentService.verifyPayment>[0]
    );
    sendSuccess(res, { booking }, "Payment verified — booking confirmed!");
  } catch (err) { next(err); }
}

export async function handleWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const sig = req.headers["x-razorpay-signature"] as string;
    await paymentService.handleWebhook(JSON.stringify(req.body), sig);
    res.json({ received: true });
  } catch (err) { next(err); }
}

export async function initiateRefund(req: Request, res: Response, next: NextFunction) {
  try {
    const bookingId = Array.isArray(req.params["bookingId"]) ? req.params["bookingId"][0] : req.params["bookingId"];
    const refund = await paymentService.initiateRefund(bookingId!);
    sendSuccess(res, { refund }, "Refund initiated");
  } catch (err) { next(err); }
}