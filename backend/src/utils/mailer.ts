import nodemailer, { type Transporter, type SentMessageInfo } from "nodemailer";
import { env } from "../config/env";
import { logger } from "./logger";

/* ══════════════════════════════════════════════════════
   TRANSPORTER
══════════════════════════════════════════════════════ */
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host:   env.SMTP_HOST,
    port:   env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth:   { user: env.SMTP_USER, pass: env.SMTP_PASS },
    pool:   true,
    maxConnections: 5,
    maxMessages:    100,
  });

  return transporter;
}

/* ── Verify connection on startup ────────────────────── */
export async function verifyMailer(): Promise<boolean> {
  try {
    await getTransporter().verify();
    logger.info("✅  Mailer connected");
    return true;
  } catch (err) {
    logger.warn("⚠️   Mailer connection failed (emails disabled):", err);
    return false;
  }
}

/* ══════════════════════════════════════════════════════
   BASE SENDER
══════════════════════════════════════════════════════ */
export interface MailOptions {
  to:       string | string[];
  subject:  string;
  html:     string;
  text?:    string;
  cc?:      string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content:  Buffer | string;
    contentType?: string;
  }>;
}

export async function sendMail(options: MailOptions): Promise<SentMessageInfo | null> {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    logger.warn(`Mailer not configured — skipping email to ${String(options.to)}`);
    return null;
  }

  try {
    const info = await getTransporter().sendMail({
      from:        env.EMAIL_FROM,
      to:          options.to,
      subject:     options.subject,
      html:        options.html,
      text:        options.text ?? htmlToText(options.html),
      cc:          options.cc,
      replyTo:     options.replyTo,
      attachments: options.attachments,
    });

    logger.info(`📧  Email sent to ${String(options.to)} — MessageId: ${info.messageId as string}`);
    return info;
  } catch (err) {
    logger.error(`Failed to send email to ${String(options.to)}:`, err);
    return null; // Non-fatal — don't break the request
  }
}

/* ══════════════════════════════════════════════════════
   BASE TEMPLATE
══════════════════════════════════════════════════════ */
export function baseTemplate(content: string, title = "Glamr"): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Segoe UI',system-ui,sans-serif; background:#0C0B09; color:#F2EDE4; -webkit-font-smoothing:antialiased; }
    .wrapper { max-width:580px; margin:40px auto; padding:0 16px; }
    .card { background:#1E1B16; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.07); }
    .header { background:#E8A020; padding:28px 32px; text-align:center; }
    .header-logo { font-size:26px; font-weight:800; color:#000; letter-spacing:-0.5px; }
    .header-tagline { font-size:12px; color:rgba(0,0,0,0.6); margin-top:4px; }
    .body { padding:32px; }
    .body p { color:#A89F92; line-height:1.75; margin-bottom:16px; font-size:15px; }
    .body p strong { color:#F2EDE4; font-weight:600; }
    .highlight { background:#282420; border-radius:14px; padding:22px 24px; margin:22px 0; border:1px solid rgba(255,255,255,0.06); }
    .highlight p { margin-bottom:10px; font-size:14px; }
    .highlight p:last-child { margin-bottom:0; }
    .btn { display:inline-block; background:#E8A020; color:#000; font-weight:700; font-size:15px; padding:13px 30px; border-radius:10px; text-decoration:none; margin:8px 0; }
    .btn:hover { background:#F5C842; }
    .divider { height:1px; background:rgba(255,255,255,0.07); margin:24px 0; }
    .footer { background:#141210; padding:20px 32px; text-align:center; }
    .footer p { color:#6B6459; font-size:12px; line-height:1.6; }
    .footer a { color:#6B6459; text-decoration:underline; }
    @media (max-width:600px) {
      .body { padding:24px 20px; }
      .header { padding:22px 20px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-logo">✂ Glamr</div>
        <div class="header-tagline">Mumbai's Salon Marketplace</div>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Glamr Technologies Pvt. Ltd.</p>
        <p style="margin-top:6px">Made with ❤️ in Mumbai</p>
        <p style="margin-top:10px">
          <a href="${env.FRONTEND_URL}/privacy">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="${env.FRONTEND_URL}/terms">Terms</a> &nbsp;·&nbsp;
          <a href="${env.FRONTEND_URL}/contact">Contact</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/* ══════════════════════════════════════════════════════
   INDIVIDUAL MAILERS
══════════════════════════════════════════════════════ */

/** Welcome email after signup */
export async function sendWelcome(to: string, name: string) {
  const html = baseTemplate(`
    <p>Hi <strong>${name}</strong> 👋</p>
    <p>Welcome to <strong>Glamr</strong> — Mumbai's #1 salon marketplace! We're so glad you're here.</p>
    <div class="highlight">
      <p>🔍 <strong>Browse</strong> 1,200+ verified salons across Mumbai</p>
      <p>⚡ <strong>Book</strong> appointments in under 2 minutes</p>
      <p>💰 <strong>Save</strong> with exclusive member deals every week</p>
      <p>⭐ <strong>Track</strong> your bookings and earn loyalty points</p>
    </div>
    <p>Start exploring the best salons in your area right now:</p>
    <a class="btn" href="${env.FRONTEND_URL}/explore">Explore Salons →</a>
    <div class="divider"></div>
    <p style="font-size:13px;color:#6B6459">Need help? Reply to this email or visit our <a href="${env.FRONTEND_URL}/contact" style="color:#E8A020">contact page</a>.</p>
  `, "Welcome to Glamr!");

  return sendMail({ to, subject: "Welcome to Glamr! ✂️", html });
}

/** Booking confirmation */
export async function sendBookingConfirmation(to: string, data: {
  name:          string;
  bookingNumber: string;
  salonName:     string;
  salonAddress:  string;
  salonPhone:    string;
  date:          string;
  time:          string;
  services:      string[];
  total:         number;
  bookingUrl:    string;
}) {
  const html = baseTemplate(`
    <p>Hi <strong>${data.name}</strong>,</p>
    <p>Your booking is <strong style="color:#4ADE80">confirmed</strong>! Here's everything you need:</p>
    <div class="highlight">
      <p>📋 <strong>Booking ID:</strong> ${data.bookingNumber}</p>
      <p>💇 <strong>Salon:</strong> ${data.salonName}</p>
      <p>📍 <strong>Address:</strong> ${data.salonAddress}</p>
      <p>📞 <strong>Phone:</strong> ${data.salonPhone}</p>
      <p>📅 <strong>Date:</strong> ${data.date}</p>
      <p>🕐 <strong>Time:</strong> ${data.time}</p>
      <p>✨ <strong>Services:</strong> ${data.services.join(", ")}</p>
      <p>💰 <strong>Total:</strong> ₹${data.total.toLocaleString("en-IN")}</p>
    </div>
    <p>Please arrive <strong>5 minutes early</strong>. Free cancellation up to <strong>2 hours</strong> before your appointment.</p>
    <a class="btn" href="${data.bookingUrl}">View Booking</a>
    <div class="divider"></div>
    <p style="font-size:13px;color:#6B6459">Need to reschedule or cancel? Visit your bookings page or call the salon directly.</p>
  `, `Booking Confirmed — ${data.bookingNumber}`);

  return sendMail({ to, subject: `Booking Confirmed ✅ — ${data.bookingNumber}`, html });
}

/** Booking reminder (sent day before) */
export async function sendBookingReminder(to: string, data: {
  name:      string;
  salonName: string;
  address:   string;
  date:      string;
  time:      string;
  mapUrl?:   string;
}) {
  const html = baseTemplate(`
    <p>Hi <strong>${data.name}</strong>,</p>
    <p>Just a friendly reminder — your appointment is <strong>tomorrow</strong>! 💛</p>
    <div class="highlight">
      <p>💇 <strong>${data.salonName}</strong></p>
      <p>📍 ${data.address}</p>
      <p>📅 <strong>${data.date}</strong> at <strong>${data.time}</strong></p>
    </div>
    ${data.mapUrl ? `<a class="btn" href="${data.mapUrl}" style="background:#282420;color:#E8A020;border:1px solid rgba(232,160,32,0.3)">Get Directions 📍</a>` : ""}
    <p style="margin-top:16px">See you there! We hope you enjoy your experience. ✨</p>
  `, `Reminder: Tomorrow at ${data.salonName}`);

  return sendMail({ to, subject: `Reminder: Appointment Tomorrow at ${data.salonName} 💛`, html });
}

/** Booking cancellation */
export async function sendCancellation(to: string, data: {
  name:          string;
  bookingNumber: string;
  salonName:     string;
  date:          string;
  reason?:       string;
  wasRefunded:   boolean;
}) {
  const html = baseTemplate(`
    <p>Hi <strong>${data.name}</strong>,</p>
    <p>Your booking <strong>${data.bookingNumber}</strong> at <strong>${data.salonName}</strong> on <strong>${data.date}</strong> has been <strong style="color:#E8525A">cancelled</strong>.</p>
    ${data.reason ? `<div class="highlight"><p>📝 <strong>Reason:</strong> ${data.reason}</p></div>` : ""}
    ${data.wasRefunded ? `<p>Your refund will be processed within <strong>5–7 business days</strong>.</p>` : ""}
    <p>Ready to book again? We have thousands of great salons waiting for you.</p>
    <a class="btn" href="${env.FRONTEND_URL}/explore">Browse Salons</a>
  `, `Booking Cancelled — ${data.bookingNumber}`);

  return sendMail({ to, subject: `Booking Cancelled — ${data.bookingNumber}`, html });
}

/** Password reset */
export async function sendPasswordReset(to: string, name: string, token: string) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  const html     = baseTemplate(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your Glamr password. Click the button below — this link expires in <strong>10 minutes</strong>.</p>
    <a class="btn" href="${resetUrl}">Reset Password</a>
    <div class="divider"></div>
    <p style="font-size:13px;color:#6B6459">If you didn't request a password reset, you can safely ignore this email. Your account is secure.</p>
  `, "Reset Your Password");

  return sendMail({ to, subject: "Reset Your Glamr Password 🔐", html });
}

/** OTP email verification */
export async function sendEmailOTP(to: string, name: string, otp: string) {
  const html = baseTemplate(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Use the verification code below to verify your email address. This code expires in <strong>10 minutes</strong>.</p>
    <div class="highlight" style="text-align:center">
      <p style="font-size:40px;font-weight:900;letter-spacing:12px;color:#F2EDE4;font-family:monospace">${otp}</p>
    </div>
    <p style="font-size:13px;color:#6B6459">Never share this code with anyone, including Glamr support.</p>
  `, "Verify Your Email");

  return sendMail({ to, subject: `${otp} — Your Glamr Verification Code`, html });
}

/* ── Utility: strip HTML for text fallback ───────────── */
function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}