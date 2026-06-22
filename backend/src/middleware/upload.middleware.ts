import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { AppError } from "../utils/AppError";

const ALLOWED_MIME = ["image/jpeg","image/png","image/webp","image/avif"];
const MAX_SIZE_MB  = 5;

const storage = multer.memoryStorage(); // Store in memory → upload to Cloudinary

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    cb(AppError.badRequest(`Only ${ALLOWED_MIME.join(", ")} are allowed`));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

/* ── Named field configs ─────────────────────────────── */
export const uploadSingleImage  = upload.single("image");
export const uploadMultipleImages = upload.array("images", 10);
export const uploadAvatar       = upload.single("avatar");