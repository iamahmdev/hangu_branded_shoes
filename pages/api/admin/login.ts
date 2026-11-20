import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedAdmin } from "../../../src/lib/unifiedDb";
import { generateToken } from "../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { usernameOrEmail, username, email, password } = req.body || {};
    const identifier = (usernameOrEmail || username || email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!identifier || !cleanPassword) {
      return res.status(400).json({ success: false, message: "Username/email and password are required." });
    }

    const admin = await UnifiedAdmin.findByUsername(identifier);

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated." });
    }

    const isMatch = await admin.comparePassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    await UnifiedAdmin.updateLastLogin(admin.id);

    const token = generateToken(String(admin.id), admin.role);

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: new Date(),
      },
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
}
