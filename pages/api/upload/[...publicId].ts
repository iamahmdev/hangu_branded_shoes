import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../../src/lib/cloudinary";
import { verifyToken } from "../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

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
  const fullPublicId = Array.isArray(publicId) ? publicId.join("/") : publicId;

  if (!fullPublicId) {
    return res.status(400).json({ success: false, message: "Cloudinary publicId is required for deletion." });
  }

  try {
    const result = await cloudinary.uploader.destroy(fullPublicId);
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
