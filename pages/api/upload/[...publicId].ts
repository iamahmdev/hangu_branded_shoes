import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import dbConnect from "../../../src/lib/dbConnect";
import UploadedImage from "../../../src/models/UploadedImage";
import { verifyToken } from "../../../src/lib/jwt";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { publicId } = req.query;
  const rawId = Array.isArray(publicId) ? publicId.join("/") : publicId || "";
  const cleanId = rawId.replace(/\.[a-zA-Z0-9]+$/, "");

  if (req.method === "GET") {
    if (!cleanId || !mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(404).json({ success: false, message: "Invalid image ID" });
    }

    try {
      await dbConnect();
      const imageDoc = await UploadedImage.findById(cleanId).lean();

      if (!imageDoc || !imageDoc.data) {
        return res.status(404).json({ success: false, message: "Image not found" });
      }

      const imageBuffer = Buffer.isBuffer(imageDoc.data)
        ? imageDoc.data
        : Buffer.from((imageDoc.data as any).buffer || imageDoc.data);

      res.setHeader("Content-Type", imageDoc.contentType || "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Content-Length", imageBuffer.length);

      return res.status(200).send(imageBuffer);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to retrieve image" });
    }
  }

  if (req.method === "DELETE") {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!cleanId) {
      return res.status(400).json({ success: false, message: "Image ID is required for deletion." });
    }

    try {
      await dbConnect();
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        await UploadedImage.findByIdAndDelete(cleanId);
      }
      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to delete image.",
      });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
