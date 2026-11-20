import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { UnifiedImage } from "../../../src/lib/unifiedDb";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", ["GET", "HEAD"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;
  const rawId = Array.isArray(id) ? id[0] : id;

  if (!rawId) {
    return res.status(400).json({ success: false, message: "Image ID is required" });
  }

  // Strip optional file extension (e.g., .webp, .jpg)
  const cleanId = rawId.replace(/\.[a-zA-Z0-9]+$/, "");

  // 1. FAST DISK CACHE: Check Hostinger Disk (public/uploads) first
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const candidates = [
      { file: `${cleanId}.webp`, mime: "image/webp" },
      { file: `${cleanId}.jpg`, mime: "image/jpeg" },
      { file: `${cleanId}.jpeg`, mime: "image/jpeg" },
      { file: `${cleanId}.png`, mime: "image/png" },
    ];

    for (const c of candidates) {
      const diskPath = path.join(uploadsDir, c.file);
      if (fs.existsSync(diskPath)) {
        const fileBuf = fs.readFileSync(diskPath);
        res.setHeader("Content-Type", c.mime);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Content-Length", fileBuf.length);
        return res.status(200).send(fileBuf);
      }
    }
  } catch (diskErr) {
    // If disk check fails, safely proceed to MySQL lookup
  }

  // 2. MySQL DATABASE FALLBACK: If not yet on disk, fetch from MySQL and cache to disk
  try {
    const imageDoc = await UnifiedImage.findById(cleanId);

    if (!imageDoc || !imageDoc.data) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    let imageBuffer = Buffer.isBuffer(imageDoc.data)
      ? imageDoc.data
      : Buffer.from((imageDoc.data as any).buffer || imageDoc.data);

    let contentType = imageDoc.contentType || "image/webp";

    // Dynamic HEIC conversion guard
    const isHeic =
      contentType.includes("heic") ||
      (imageDoc.filename && imageDoc.filename.toLowerCase().endsWith(".heic")) ||
      (imageBuffer.length > 12 && imageBuffer.toString("ascii", 4, 12).includes("ftypheic"));

    if (isHeic) {
      try {
        const convert = (await import("heic-convert")).default;
        const converted = await convert({
          buffer: imageBuffer,
          format: "JPEG",
          quality: 0.85,
        });
        imageBuffer = Buffer.from(converted);
        contentType = "image/jpeg";
      } catch (convErr: any) {
        console.warn("Dynamic HEIC conversion failed, sending original buffer:", convErr.message);
      }
    }

    // Auto-cache to Hostinger disk for future lightning-fast requests
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const ext = contentType.includes("png") ? ".png" : contentType.includes("jpeg") ? ".jpg" : ".webp";
      fs.writeFileSync(path.join(uploadsDir, `${cleanId}${ext}`), imageBuffer);
    } catch {}

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Length", imageBuffer.length);

    return res.status(200).send(imageBuffer);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to retrieve image" });
  }
}
