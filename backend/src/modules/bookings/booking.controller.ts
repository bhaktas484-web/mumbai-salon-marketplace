import type { Request, Response, NextFunction } from "express";
import * as bookingService from "./booking.service";
import { sendSuccess, sendCreated } from "../../utils/apiResponse";

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.createBooking({
      userId: req.user!.id,
      ...(req.body as object),
    } as Parameters<typeof bookingService.createBooking>[0]);
    sendCreated(res, { booking }, "Booking created successfully");
  } catch (err) { next(err); }
}

export async function getMyBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const status   = req.query["status"] as string | undefined;
    const bookings = await bookingService.getMyBookings(req.user!.id, status);
    sendSuccess(res, { bookings });
  } catch (err) { next(err); }
}

export async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
    const userId = req.user?.id;
    if (!id || !userId) throw new Error("Booking ID and user ID are required");
    const booking = await bookingService.getBookingById(id, userId);
    sendSuccess(res, { booking });
  } catch (err) { next(err); }
}

export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body as { reason?: string };
    const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
    const booking = await bookingService.cancelBooking(
      id!, req.user!.id, reason ?? "Cancelled by customer"
    );
    sendSuccess(res, { booking }, "Booking cancelled");
  } catch (err) { next(err); }
}

export async function getSalonBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, status } = req.query as { date?: string; status?: string };
    const salonId = Array.isArray(req.params["salonId"]) ? req.params["salonId"][0] : req.params["salonId"];
    if (!salonId) throw new Error("Salon ID is required");
    const bookings = await bookingService.getSalonBookings(
      salonId, date, status
    );
    sendSuccess(res, { bookings });
  } catch (err) { next(err); }
}

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status: string };
    const id = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
    const salonId = Array.isArray(req.params["salonId"]) ? req.params["salonId"][0] : req.params["salonId"];
    if (!id || !salonId) throw new Error("Booking ID and salon ID are required");
    const booking = await bookingService.updateBookingStatus(
      id,
      status as Parameters<typeof bookingService.updateBookingStatus>[1],
      salonId
    );
    sendSuccess(res, { booking }, "Status updated");
  } catch (err) { next(err); }
}

export async function getAvailableSlots(req: Request, res: Response, next: NextFunction) {
  try {
    const { salonId, date } = req.params as { salonId: string; date: string };
    const slots = await bookingService.getAvailableSlots(salonId, date);
    sendSuccess(res, { slots });
  } catch (err) { next(err); }
}