import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import dbConnect from "../../../src/lib/dbConnect";
import UploadedImage from "../../../src/models/UploadedImage";

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

  if (cleanId === "latest") {
    try {
      await dbConnect();
      const latest = await UploadedImage.find().sort({ createdAt: -1 }).limit(5).select('_id filename contentType size createdAt').lean();
      return res.status(200).json({ success: true, count: latest.length, data: latest });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  if (!mongoose.Types.ObjectId.isValid(cleanId)) {
    return res.status(404).json({ success: false, message: "Invalid image ID" });
  }

  try {
    await dbConnect();
    const imageDoc = await UploadedImage.findById(cleanId).lean();

    if (!imageDoc || !imageDoc.data) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // Convert MongoDB Binary / Buffer reliably
    let imageBuffer: Buffer;
    if (Buffer.isBuffer(imageDoc.data)) {
      imageBuffer = imageDoc.data;
    } else if (typeof (imageDoc.data as any).value === "function") {
      imageBuffer = (imageDoc.data as any).value(true);
    } else if ((imageDoc.data as any).buffer) {
      imageBuffer = Buffer.from((imageDoc.data as any).buffer);
    } else {
      imageBuffer = Buffer.from(imageDoc.data as any);
    }

    let finalContentType = imageDoc.contentType || "image/webp";

    // If stored as HEIC or generic octet-stream, dynamically convert to JPEG for browser support
    const isHeic =
      finalContentType.includes("octet-stream") ||
      finalContentType.includes("heic") ||
      imageDoc.filename?.toLowerCase().endsWith(".heic") ||
      imageDoc.filename?.toLowerCase().endsWith(".heif");

    if (isHeic && finalContentType !== "image/webp" && finalContentType !== "image/jpeg") {
      try {
        const heicConvert = require("heic-convert");
        const converted = await heicConvert({
          buffer: imageBuffer,
          format: "JPEG",
          quality: 0.9,
        });
        imageBuffer = Buffer.from(converted);
        finalContentType = "image/jpeg";
      } catch (err) {
        console.error("HEIC dynamic conversion failed:", err);
      }
    }

    res.setHeader("Content-Type", finalContentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Length", String(imageBuffer.length));

    if (req.method === "HEAD") {
      return res.status(200).end();
    }

    return res.status(200).end(imageBuffer);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to retrieve image" });
  }
}
