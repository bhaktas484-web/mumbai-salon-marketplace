import { z } from "zod";

/* ── Working hours sub-schema ────────────────────────── */
const workingHoursSchema = z.object({
  open:     z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM").default("10:00"),
  close:    z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM").default("20:00"),
  isClosed: z.boolean().default(false),
});

/* ── Stylist sub-schema ──────────────────────────────── */
const stylistSchema = z.object({
  name:        z.string().min(2).max(60),
  avatar:      z.string().url().optional(),
  specialties: z.array(z.string()).default([]),
  experience:  z.number().int().min(0).default(0),
  bio:         z.string().max(500).optional(),
});

/* ── Create salon schema ─────────────────────────────── */
export const createSalonSchema = z.object({
  name:        z.string().min(2).max(100),
  tagline:     z.string().max(120).optional(),
  description: z.string().min(20).max(2000),

  tier:   z.enum(["Standard", "Premium", "Luxury"]).default("Standard"),
  gender: z.enum(["Women", "Men", "Unisex"]).default("Unisex"),

  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),  // [lng, lat]
    address:     z.string().min(5),
    landmark:    z.string().optional(),
    area:        z.string().min(2),
    city:        z.string().default("Mumbai"),
    pincode:     z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  }),

  phone:            z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone"),
  email:            z.string().email().optional(),
  website:          z.string().url().optional(),
  instagramHandle:  z.string().optional(),
  whatsapp:         z.string().optional(),

  workingHours: z.object({
    monday:    workingHoursSchema.optional(),
    tuesday:   workingHoursSchema.optional(),
    wednesday: workingHoursSchema.optional(),
    thursday:  workingHoursSchema.optional(),
    friday:    workingHoursSchema.optional(),
    saturday:  workingHoursSchema.optional(),
    sunday:    workingHoursSchema.optional(),
  }).optional(),

  stylists:  z.array(stylistSchema).default([]),
  amenities: z.array(z.string()).default([]),
  tags:      z.array(z.string()).default([]),
});

/* ── Update salon schema (all fields optional) ───────── */
export const updateSalonSchema = createSalonSchema.partial();

/* ── Types inferred from schemas ─────────────────────── */
export type CreateSalonDTO = z.infer<typeof createSalonSchema>;
export type UpdateSalonDTO = z.infer<typeof updateSalonSchema>;