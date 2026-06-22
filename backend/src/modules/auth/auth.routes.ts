import { Router } from "express";
import { z } from "zod";
import * as ctrl from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { authLimiter } from "../../middleware/rateLimiter";

export const authRouter = Router();

/* ── Validation schemas ──────────────────────────────── */
const signupSchema = z.object({
  name:     z.string().min(2, "Name min 2 chars").max(60),
  email:    z.string().email("Invalid email"),
  password: z.string()
    .min(8, "Password min 8 chars")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  phone:    z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone").optional(),
  role:     z.enum(["customer","salon_owner"]).optional(),
});

const loginSchema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

const changePassSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword:     z.string()
    .min(8, "Password min 8 chars")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

const updateProfileSchema = z.object({
  name:  z.string().min(2).max(60).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/).optional(),
  preferences: z.object({
    preferredAreas:       z.array(z.string()).optional(),
    preferredGender:      z.enum(["Women","Men","Unisex"]).nullable().optional(),
    notificationsEnabled: z.boolean().optional(),
    smsEnabled:           z.boolean().optional(),
    emailEnabled:         z.boolean().optional(),
    reminderMinutes:      z.union([z.literal(15),z.literal(30),z.literal(60),z.literal(120)]).optional(),
  }).optional(),
}).refine(data => Object.keys(data).length > 0, { message: "At least one field required" });

/* ── Public routes ───────────────────────────────────── */
authRouter.post("/signup",          authLimiter, validate(signupSchema),    ctrl.signup);
authRouter.post("/login",           authLimiter, validate(loginSchema),     ctrl.login);
authRouter.post("/refresh",                                                  ctrl.refresh);
authRouter.post("/forgot-password", authLimiter,
  validate(z.object({ email: z.string().email() })),
  ctrl.forgotPassword
);
authRouter.post("/reset-password",
  validate(z.object({
    token:    z.string().min(1),
    password: z.string().min(8),
  })),
  ctrl.resetPassword
);

/* ── Protected routes ────────────────────────────────── */
authRouter.use(protect);

authRouter.get(   "/me",                             ctrl.getMe);
authRouter.patch( "/me",       validate(updateProfileSchema), ctrl.updateProfile);
authRouter.post(  "/logout",                         ctrl.logout);
authRouter.patch( "/change-password", validate(changePassSchema), ctrl.changePassword);
authRouter.post(  "/favourites/:salonId",            ctrl.toggleFavourite);