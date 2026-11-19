import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import sharp from "sharp";
import mongoose from "mongoose";
import dbConnect from "../../../src/lib/dbConnect";
import UploadedImage from "../../../src/models/UploadedImage";
import { verifyToken } from "../../../src/lib/jwt";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Check admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    try {
      const form = formidable({
        keepExtensions: true,
        maxFileSize: 15 * 1024 * 1024, // 15MB
      });

      const [, files] = await form.parse(req);
      const fileArray = files.image;
      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

      if (!file || !file.filepath) {
        return res.status(400).json({ success: false, message: "No image file provided." });
      }

      // Read file into buffer
      let fileBuffer = fs.readFileSync(file.filepath);

      // Clean up temp file immediately
      try {
        fs.unlinkSync(file.filepath);
      } catch {
        // Ignore temp cleanup errors
      }

      // Automatically convert iPhone HEIC/HEIF images to JPEG so browsers can display them
      const originalName = (file.originalFilename || "").toLowerCase();
      const isHeic =
        originalName.endsWith(".heic") ||
        originalName.endsWith(".heif") ||
        file.mimetype?.includes("heic") ||
        file.mimetype?.includes("heif");

      if (isHeic) {
        try {
          const heicConvert = require("heic-convert");
          const converted = await heicConvert({
            buffer: fileBuffer,
            format: "JPEG",
            quality: 0.9,
          });
          fileBuffer = Buffer.from(converted);
        } catch (heicErr) {
          console.error("HEIC conversion failed:", heicErr);
        }
      }

      // Optimize image with sharp to high-performance WebP
      let optimizedBuffer: Buffer;
      let contentType = "image/webp";
      try {
        optimizedBuffer = await sharp(fileBuffer)
          .rotate() // auto-orient based on EXIF
          .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 })
          .toBuffer();
      } catch {
        // Fallback to original buffer if sharp fails on rare formats
        optimizedBuffer = fileBuffer;
        contentType = file.mimetype || "image/jpeg";
      }

      // Save directly to MongoDB
      await dbConnect();
      const saved = await UploadedImage.create({
        filename: file.originalFilename || `shoe_${Date.now()}.webp`,
        contentType,
        data: optimizedBuffer,
        size: optimizedBuffer.length,
      });

      return res.status(200).json({
        success: true,
        data: {
          url: `/api/images/${saved._id}`,
          publicId: String(saved._id),
          format: "webp",
          bytes: optimizedBuffer.length,
        },
        message: "Image uploaded successfully",
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: `Image upload failed: ${err.message || "Unknown error"}`,
      });
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

    const { publicId } = req.query;
    if (!publicId) {
      return res.status(400).json({ success: false, message: "Image ID is required for deletion." });
    }

    try {
      await dbConnect();
      const cleanId = String(publicId).replace(/\.[a-zA-Z0-9]+$/, "");
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

  res.setHeader("Allow", ["POST", "DELETE"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
