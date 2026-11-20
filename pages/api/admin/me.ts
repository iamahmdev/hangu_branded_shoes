import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedAdmin } from "../../../src/lib/unifiedDb";
import { verifyToken } from "../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const admin = await UnifiedAdmin.findByUsername("admin");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch profile" });
  }
}
