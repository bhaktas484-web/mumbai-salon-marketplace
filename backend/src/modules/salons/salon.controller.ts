import type { Request, Response, NextFunction } from "express";
import * as salonService from "./salon.service";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/apiResponse";

export async function listSalons(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", pageSize = "12", ...filters } = req.query as Record<string, string | string[]>;
    const result = await salonService.listSalons(filters, Number(page), Number(pageSize));
    sendPaginated(res, result.salons, result.total, result.page, result.pageSize);
  } catch (err) { next(err); }
}

export async function getSalonBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const salon = await salonService.getSalonBySlug(req.params["slug"]!);
    sendSuccess(res, { salon });
  } catch (err) { next(err); }
}

export async function getFeaturedSalons(_req: Request, res: Response, next: NextFunction) {
  try {
    const salons = await salonService.getFeaturedSalons();
    sendSuccess(res, { salons });
  } catch (err) { next(err); }
}

export async function getTrendingSalons(req: Request, res: Response, next: NextFunction) {
  try {
    const area   = req.query["area"] as string | undefined;
    const salons = await salonService.getTrendingSalons(area);
    sendSuccess(res, { salons });
  } catch (err) { next(err); }
}

export async function getNearbySalons(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng, radius } = req.query as Record<string, string>;
    const salons = await salonService.getNearbySalons(
      Number(lat), Number(lng), radius ? Number(radius) : 5
    );
    sendSuccess(res, { salons });
  } catch (err) { next(err); }
}

export async function createSalon(req: Request, res: Response, next: NextFunction) {
  try {
    const salon = await salonService.createSalon(
      req.body as Record<string, unknown>, req.user!.id
    );
    sendCreated(res, { salon }, "Salon created successfully");
  } catch (err) { next(err); }
}

export async function updateSalon(req: Request, res: Response, next: NextFunction) {
  try {
    const salon = await salonService.updateSalon(
      req.params["slug"]!, req.body as Record<string, unknown>, req.user!.id
    );
    sendSuccess(res, { salon }, "Salon updated");
  } catch (err) { next(err); }
}

export async function getSalonServices(req: Request, res: Response, next: NextFunction) {
  try {
    const services = await salonService.getSalonServices(req.params["id"]!);
    sendSuccess(res, { services });
  } catch (err) { next(err); }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await salonService.createService(
      req.params["id"]!, req.body as Record<string, unknown>
    );
    sendCreated(res, { service }, "Service added");
  } catch (err) { next(err); }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await salonService.updateService(
      req.params["serviceId"]!, req.body as Record<string, unknown>
    );
    sendSuccess(res, { service }, "Service updated");
  } catch (err) { next(err); }
}