import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure:     true,
});

/* ── Upload image ────────────────────────────────────── */
export async function uploadImage(
  fileBuffer: Buffer,
  folder      = "glamr/salons",
  options:    Record<string, unknown> = {}
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality:       "auto:good",
        fetch_format:  "auto",
        transformation: [{ width: 1200, height: 800, crop: "fill", gravity: "auto" }],
        ...options,
      },
      (err, result) => {
        if (err || !result) { reject(err ?? new Error("Upload failed")); return; }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    ).end(fileBuffer);
  });
}

/* ── Delete image ────────────────────────────────────── */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/* ── Upload avatar (smaller, circular) ───────────────── */
export async function uploadAvatar(fileBuffer: Buffer, userId: string) {
  return uploadImage(fileBuffer, "glamr/avatars", {
    public_id:      `avatar_${userId}`,
    overwrite:      true,
    transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face", radius: "max" }],
  });
}