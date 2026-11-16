import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import cloudinary from "../../../src/lib/cloudinary";
import { verifyToken } from "../../../src/lib/jwt";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Check auth
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Verify Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary credentials not configured in environment variables.",
      });
    }

    try {
      const form = formidable({
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });

      const [, files] = await form.parse(req);
      const fileArray = files.image;
      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

      if (!file || !file.filepath) {
        return res.status(400).json({ success: false, message: "No image file provided." });
      }

      const uploadResult = await cloudinary.uploader.upload(file.filepath, {
        folder: "hangu-branded-shoes",
        resource_type: "image",
      });

      // Remove temporary file
      try {
        fs.unlinkSync(file.filepath);
      } catch {
        // Ignore temp cleanup errors
      }

      return res.status(200).json({
        success: true,
        data: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        },
        message: "Image uploaded to Cloudinary successfully",
      });
    } catch (err: any) {
      return res.status(502).json({
        success: false,
        message: `Cloudinary upload failed: ${err.message || "Upload error"}`,
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
      return res.status(400).json({ success: false, message: "Cloudinary publicId is required for deletion." });
    }

    try {
      const result = await cloudinary.uploader.destroy(String(publicId));
      return res.status(200).json({
        success: true,
        message: "Image deleted from Cloudinary successfully",
        result,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to delete image from Cloudinary.",
      });
    }
  }

  res.setHeader("Allow", ["POST", "DELETE"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
