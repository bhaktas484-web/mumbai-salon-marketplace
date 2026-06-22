import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, type IUser } from "./user.model";
import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";
import { cache, CacheKey } from "../../config/redis";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../notifications/notification.service";

/* ══════════════════════════════════════════════════════
   TOKEN HELPERS
══════════════════════════════════════════════════════ */

export function signAccessToken(user: IUser): string {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions["expiresIn"] }
  );
}

export function signRefreshToken(user: IUser): string {
  return jwt.sign(
    { id: user._id.toString() },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions["expiresIn"] }
  );
}

/* Save tokens to DB + cache */
async function persistTokens(user: IUser, refreshToken: string) {
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  await cache.set(CacheKey.user(user._id.toString()), user.toSafeJSON(), 900);
}

/* ══════════════════════════════════════════════════════
   SIGNUP
══════════════════════════════════════════════════════ */
export async function signup(dto: {
  name:     string;
  email:    string;
  password: string;
  phone?:   string;
  role?:    "customer" | "salon_owner";
}) {
  /* Check duplicate */
  const existing = await User.findOne({ email: dto.email.toLowerCase() });
  if (existing) throw AppError.conflict("An account with this email already exists");

  /* Create user */
  const user = await User.create({
    name:         dto.name.trim(),
    email:        dto.email.toLowerCase(),
    password:     dto.password,
    phone:        dto.phone,
    role:         dto.role ?? "customer",
    authProvider: "email",
  });

  /* Generate tokens */
  const accessToken  = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistTokens(user, refreshToken);

  /* Send welcome email (non-blocking) */
  void sendWelcomeEmail({ to: user.email, name: user.name });

  return { user: user.toSafeJSON(), accessToken, refreshToken };
}

/* ══════════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════════ */
export async function login(dto: { email: string; password: string }) {
  /* Fetch with password field */
  const user = await User.findOne({ email: dto.email.toLowerCase() }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(dto.password))) {
    throw AppError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw AppError.forbidden("Your account has been deactivated. Please contact support.");
  }

  const accessToken  = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistTokens(user, refreshToken);

  return { user: user.toSafeJSON(), accessToken, refreshToken };
}

/* ══════════════════════════════════════════════════════
   REFRESH TOKEN
══════════════════════════════════════════════════════ */
export async function refreshAccessToken(token: string) {
  if (!token) throw AppError.unauthorized("Refresh token required");

  let payload: { id: string };
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw AppError.unauthorized("Refresh token has been revoked");
  }

  const accessToken     = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);
  await persistTokens(user, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}

/* ══════════════════════════════════════════════════════
   LOGOUT
══════════════════════════════════════════════════════ */
export async function logout(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  await cache.del(CacheKey.user(userId));
}

/* ══════════════════════════════════════════════════════
   GET ME
══════════════════════════════════════════════════════ */
export async function getMe(userId: string) {
  const cached = await cache.get(CacheKey.user(userId));
  if (cached) return cached;

  const user = await User.findById(userId);
  if (!user) throw AppError.notFound("User");

  const safe = user.toSafeJSON();
  await cache.set(CacheKey.user(userId), safe, 900);
  return safe;
}

/* ══════════════════════════════════════════════════════
   UPDATE PROFILE
══════════════════════════════════════════════════════ */
export async function updateProfile(userId: string, data: {
  name?:        string;
  phone?:       string;
  avatar?:      string;
  preferences?: Partial<IUser["preferences"]>;
}) {
  const allowed: Record<string, unknown> = {};
  if (data.name)        allowed["name"]        = data.name.trim();
  if (data.phone)       allowed["phone"]       = data.phone;
  if (data.avatar)      allowed["avatar"]      = data.avatar;
  if (data.preferences) allowed["preferences"] = data.preferences;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowed },
    { new: true, runValidators: true }
  );
  if (!user) throw AppError.notFound("User");

  const safe = user.toSafeJSON();
  await cache.set(CacheKey.user(userId), safe, 900);
  return safe;
}

/* ══════════════════════════════════════════════════════
   CHANGE PASSWORD
══════════════════════════════════════════════════════ */
export async function changePassword(
  userId:      string,
  currentPass: string,
  newPass:     string
) {
  const user = await User.findById(userId).select("+password");
  if (!user) throw AppError.notFound("User");

  if (!(await user.comparePassword(currentPass))) {
    throw AppError.badRequest("Current password is incorrect");
  }
  if (currentPass === newPass) {
    throw AppError.badRequest("New password must be different from current password");
  }

  user.password = newPass;
  await user.save();
  await cache.del(CacheKey.user(userId));
}

/* ══════════════════════════════════════════════════════
   FORGOT PASSWORD
══════════════════════════════════════════════════════ */
export async function forgotPassword(email: string): Promise<void> {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return; // Silently succeed (don't reveal if email exists)

  const rawToken    = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.passwordResetToken   = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save({ validateBeforeSave: false });

  void sendPasswordResetEmail({ to: user.email, name: user.name, token: rawToken });
}

/* ══════════════════════════════════════════════════════
   RESET PASSWORD
══════════════════════════════════════════════════════ */
export async function resetPassword(token: string, newPassword: string) {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken:   hashed,
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) throw AppError.badRequest("Reset token is invalid or has expired");

  user.password             = newPassword;
  user.passwordResetToken   = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken         = undefined;  // Force re-login
  await user.save();

  await cache.del(CacheKey.user(user._id.toString()));
}

/* ══════════════════════════════════════════════════════
   TOGGLE FAVOURITE SALON
══════════════════════════════════════════════════════ */
export async function toggleFavourite(userId: string, salonId: string) {
  const user = await User.findById(userId);
  if (!user) throw AppError.notFound("User");

  const salonObjId   = new mongoose.Types.ObjectId(salonId);
  const isFavourited = user.favouriteSalons.some(id => id.equals(salonObjId));

  if (isFavourited) {
    user.favouriteSalons = user.favouriteSalons.filter(id => !id.equals(salonObjId));
  } else {
    user.favouriteSalons.push(salonObjId);
  }

  await user.save({ validateBeforeSave: false });
  await cache.del(CacheKey.user(userId));

  return { isFavourited: !isFavourited };
}

import mongoose from "mongoose";