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

  if (!mongoose.Types.ObjectId.isValid(cleanId)) {
    return res.status(404).json({ success: false, message: "Invalid image ID" });
  }

  try {
    await dbConnect();
    const imageDoc = await UploadedImage.findById(cleanId).lean();

    if (!imageDoc || !imageDoc.data) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // Convert Buffer if stored as Binary
    const imageBuffer = Buffer.isBuffer(imageDoc.data)
      ? imageDoc.data
      : Buffer.from((imageDoc.data as any).buffer || imageDoc.data);

    res.setHeader("Content-Type", imageDoc.contentType || "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Length", imageBuffer.length);

    if (req.method === "HEAD") {
      return res.status(200).end();
    }

    return res.status(200).send(imageBuffer);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to retrieve image" });
  }
}
