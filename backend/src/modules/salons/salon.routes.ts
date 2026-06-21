import { Router } from "express";
import { z } from "zod";
import * as ctrl from "./salon.controller";
import { protect, restrictTo } from "../../middleware/auth.middleware";
import { validate, schemas } from "../../middleware/validate";

export const salonRouter = Router();

const serviceSchema = z.object({
  name:            z.string().min(2).max(100),
  category:        z.string().min(1),
  durationMinutes: z.number().int().min(5),
  price:           z.number().min(0),
  discountedPrice: z.number().min(0).optional(),
  gender:          z.enum(["Women","Men","Unisex"]).default("Unisex"),
  description:     z.string().optional(),
});

const nearbySchema = z.object({
  lat:    z.coerce.number(),
  lng:    z.coerce.number(),
  radius: z.coerce.number().optional(),
});

/* ── Public routes ───────────────────────────────────── */
salonRouter.get("/",           validate(schemas.pagination, "query"), ctrl.listSalons);
salonRouter.get("/featured",   ctrl.getFeaturedSalons);
salonRouter.get("/trending",   ctrl.getTrendingSalons);
salonRouter.get("/nearby",     validate(nearbySchema, "query"), ctrl.getNearbySalons);
salonRouter.get("/:slug",      ctrl.getSalonBySlug);
salonRouter.get("/:id/services", ctrl.getSalonServices);

/* ── Salon owner routes ──────────────────────────────── */
salonRouter.use(protect);

salonRouter.post("/",          restrictTo("salon_owner","admin"), ctrl.createSalon);
salonRouter.patch("/:slug",    restrictTo("salon_owner","admin"), ctrl.updateSalon);
salonRouter.post("/:id/services",   restrictTo("salon_owner","admin"),
  validate(serviceSchema), ctrl.createService);
salonRouter.patch("/:id/services/:serviceId", restrictTo("salon_owner","admin"),
  validate(serviceSchema.partial()), ctrl.updateService);