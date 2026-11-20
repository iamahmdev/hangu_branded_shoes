import type { NextApiRequest, NextApiResponse } from "next";
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

  try {
    const imageDoc = await UnifiedImage.findById(cleanId);

    if (!imageDoc || !imageDoc.data) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    const imageBuffer = Buffer.isBuffer(imageDoc.data)
      ? imageDoc.data
      : Buffer.from((imageDoc.data as any).buffer || imageDoc.data);

    // Dynamic HEIC conversion guard
    const isHeic =
      (imageDoc.contentType && imageDoc.contentType.includes("heic")) ||
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
        const outBuf = Buffer.from(converted);
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Content-Length", outBuf.length);
        return res.status(200).send(outBuf);
      } catch (convErr: any) {
        console.warn("Dynamic HEIC conversion failed, sending original buffer:", convErr.message);
      }
    }

    res.setHeader("Content-Type", imageDoc.contentType || "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Length", imageBuffer.length);

    return res.status(200).send(imageBuffer);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to retrieve image" });
  }
}
