// TypeScript environment may not have mongoose types available in some setups.
// Suppress the module/type declaration error for this file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Mongoose types may be missing in the current environment
import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

// Declare Node's process when type definitions are not installed.
declare const process: { exit(code?: number): never };

/* ── Connection options ──────────────────────────────── */
const MONGO_OPTIONS: mongoose.ConnectOptions = {
  maxPoolSize:          10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS:     45_000,
  family:              4,        // Use IPv4
};

/* ── Connect ─────────────────────────────────────────── */
export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.MONGODB_URI, MONGO_OPTIONS);

    logger.info(`✅  MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error("❌  MongoDB connection failed:", err);
    process.exit(1);
  }
}

/* ── Disconnect ──────────────────────────────────────── */
export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  logger.info("MongoDB disconnected");
}

/* ── Event listeners ─────────────────────────────────── */
mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️   MongoDB disconnected — retrying…");
});

mongoose.connection.on("error", (err: Error) => {
  logger.error("MongoDB error:", err);
});