import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { sendSuccess, sendCreated } from "../../utils/apiResponse";

/* ── Cookie config ───────────────────────────────────── */
const COOKIE_OPTIONS = {
  httpOnly:  true,
  secure:    process.env.NODE_ENV === "production",
  sameSite:  "strict" as const,
  path:      "/",
  maxAge:    7 * 24 * 60 * 60 * 1000,  // 7 days
};

/* ── Signup ──────────────────────────────────────────── */
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(
      req.body as Parameters<typeof authService.signup>[0]
    );
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    sendCreated(res, { user, accessToken }, "Account created successfully");
  } catch (err) { next(err); }
}

/* ── Login ───────────────────────────────────────────── */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body as { email: string; password: string }
    );
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, { user, accessToken }, "Login successful");
  } catch (err) { next(err); }
}

/* ── Refresh token ───────────────────────────────────── */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    /* Accept from cookie OR body (for mobile clients) */
    const token: string =
      (req.cookies?.refreshToken as string | undefined) ??
      (req.body as { refreshToken?: string }).refreshToken ??
      "";

    const { accessToken, refreshToken } = await authService.refreshAccessToken(token);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, { accessToken }, "Token refreshed");
  } catch (err) { next(err); }
}

/* ── Logout ──────────────────────────────────────────── */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.id) await authService.logout(req.user.id);
    res.clearCookie("refreshToken", { path: "/" });
    sendSuccess(res, null, "Logged out successfully");
  } catch (err) { next(err); }
}

/* ── Get me ──────────────────────────────────────────── */
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, { user });
  } catch (err) { next(err); }
}

/* ── Update profile ──────────────────────────────────── */
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.updateProfile(
      req.user!.id,
      req.body as Parameters<typeof authService.updateProfile>[1]
    );
    sendSuccess(res, { user }, "Profile updated");
  } catch (err) { next(err); }
}

/* ── Change password ─────────────────────────────────── */
export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword:     string;
    };
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    res.clearCookie("refreshToken", { path: "/" }); // Force re-login
    sendSuccess(res, null, "Password changed. Please log in again.");
  } catch (err) { next(err); }
}

/* ── Forgot password ─────────────────────────────────── */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.forgotPassword((req.body as { email: string }).email);
    /* Always return 200 — don't leak whether email exists */
    sendSuccess(res, null, "If an account exists, a password reset link has been sent");
  } catch (err) { next(err); }
}

/* ── Reset password ──────────────────────────────────── */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body as { token: string; password: string };
    await authService.resetPassword(token, password);
    sendSuccess(res, null, "Password reset successfully. Please log in.");
  } catch (err) { next(err); }
}

/* ── Toggle favourite salon ──────────────────────────── */
export async function toggleFavourite(req: Request, res: Response, next: NextFunction) {
  try {
    const salonId = Array.isArray(req.params.salonId)
      ? req.params.salonId[0]
      : req.params.salonId;

    const result = await authService.toggleFavourite(
      req.user!.id,
      salonId!
    );
    sendSuccess(res, result, result.isFavourited ? "Added to favourites" : "Removed from favourites");
  } catch (err) { next(err); }
}