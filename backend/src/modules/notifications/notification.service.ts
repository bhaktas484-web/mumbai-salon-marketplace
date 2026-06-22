import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

/* ── Transporter ─────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  host:   env.SMTP_HOST,
  port:   env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth:   { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

/* ── Base email sender ───────────────────────────────── */
async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}:`, err);
    // Non-fatal — don't throw
  }
}

/* ── Email templates ─────────────────────────────────── */
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0C0B09; color: #F2EDE4; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #1E1B16; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
    .header { background: #E8A020; padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; color: #000; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .body { padding: 32px; }
    .body p { color: #A89F92; line-height: 1.7; margin: 0 0 16px; }
    .body strong { color: #F2EDE4; }
    .highlight { background: #282420; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.07); }
    .highlight p { margin: 6px 0; }
    .btn { display: inline-block; background: #E8A020; color: #000; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin: 8px 0; }
    .footer { padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.07); }
    .footer p { color: #6B6459; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>✂ Glamr</h1></div>
    <div class="body">${content}</div>
    <div class="footer"><p>© ${new Date().getFullYear()} Glamr Technologies Pvt. Ltd. · Mumbai</p></div>
  </div>
</body>
</html>`;

/* ── Booking confirmation ─────────────────────────────── */
export async function sendBookingConfirmation(data: {
  to:            string;
  userName:      string;
  bookingNumber: string;
  salonName:     string;
  date:          string;
  time:          string;
  services:      string[];
  total:         number;
}) {
  const html = baseTemplate(`
    <p>Hi <strong>${data.userName}</strong>,</p>
    <p>Your booking is <strong style="color:#4ADE80">confirmed</strong>! Here are your details:</p>
    <div class="highlight">
      <p>📋 <strong>Booking ID:</strong> ${data.bookingNumber}</p>
      <p>💇 <strong>Salon:</strong> ${data.salonName}</p>
      <p>📅 <strong>Date:</strong> ${data.date}</p>
      <p>🕐 <strong>Time:</strong> ${data.time}</p>
      <p>✨ <strong>Services:</strong> ${data.services.join(", ")}</p>
      <p>💰 <strong>Total:</strong> ₹${data.total.toLocaleString("en-IN")}</p>
    </div>
    <p>Please arrive 5 minutes early. Free cancellation up to 2 hours before your appointment.</p>
    <a class="btn" href="${env.FRONTEND_URL}/profile">View Booking</a>
  `);
  await sendEmail(data.to, `Booking Confirmed — ${data.bookingNumber}`, html);
}

/* ── Booking cancellation ────────────────────────────── */
export async function sendBookingCancellation(data: {
  to:            string;
  userName:      string;
  bookingNumber: string;
  salonName:     string;
  date:          string;
  reason?:       string;
}) {
  const html = baseTemplate(`
    <p>Hi <strong>${data.userName}</strong>,</p>
    <p>Your booking <strong>${data.bookingNumber}</strong> at <strong>${data.salonName}</strong> on <strong>${data.date}</strong> has been cancelled.</p>
    ${data.reason ? `<p>Reason: ${data.reason}</p>` : ""}
    <p>If you paid online, a refund will be processed within 5–7 business days.</p>
    <a class="btn" href="${env.FRONTEND_URL}/explore">Book Again</a>
  `);
  await sendEmail(data.to, `Booking Cancelled — ${data.bookingNumber}`, html);
}

/* ── Booking reminder ────────────────────────────────── */
export async function sendBookingReminder(data: {
  to:        string;
  userName:  string;
  salonName: string;
  address:   string;
  date:      string;
  time:      string;
}) {
  const html = baseTemplate(`
    <p>Hi <strong>${data.userName}</strong>,</p>
    <p>Just a reminder — your appointment is <strong>tomorrow</strong>!</p>
    <div class="highlight">
      <p>💇 <strong>${data.salonName}</strong></p>
      <p>📍 ${data.address}</p>
      <p>📅 ${data.date} at <strong>${data.time}</strong></p>
    </div>
    <p>See you there! 💛</p>
  `);
  await sendEmail(data.to, `Reminder: Appointment Tomorrow at ${data.salonName}`, html);
}

/* ── Welcome email ───────────────────────────────────── */
export async function sendWelcomeEmail(data: { to: string; name: string }) {
  const html = baseTemplate(`
    <p>Hi <strong>${data.name}</strong>,</p>
    <p>Welcome to <strong>Glamr</strong> — Mumbai's #1 salon marketplace! 🎉</p>
    <p>You can now:</p>
    <div class="highlight">
      <p>🔍 Browse 1,200+ verified salons across Mumbai</p>
      <p>⚡ Book appointments in under 2 minutes</p>
      <p>💰 Get exclusive member deals every week</p>
      <p>⭐ Track your bookings and earn loyalty points</p>
    </div>
    <a class="btn" href="${env.FRONTEND_URL}/explore">Start Exploring</a>
  `);
  await sendEmail(data.to, "Welcome to Glamr! 💛", html);
}

/* ── Password reset ──────────────────────────────────── */
export async function sendPasswordResetEmail(data: {
  to:    string;
  name:  string;
  token: string;
}) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${data.token}`;
  const html = baseTemplate(`
    <p>Hi <strong>${data.name}</strong>,</p>
    <p>We received a request to reset your Glamr password.</p>
    <p>Click the button below to reset it. This link expires in <strong>10 minutes</strong>.</p>
    <a class="btn" href="${resetUrl}">Reset Password</a>
    <p style="margin-top:20px;font-size:13px;color:#6B6459">If you didn't request this, you can safely ignore this email.</p>
  `);
  await sendEmail(data.to, "Reset your Glamr password", html);
}