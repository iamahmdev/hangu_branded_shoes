import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import { Admin } from "../../../src/models/Admin";
import { generateToken } from "../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await dbConnect();
    const { usernameOrEmail, username, email, password } = req.body || {};
    const identifier = (usernameOrEmail || username || email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!identifier || !cleanPassword) {
      return res.status(400).json({ success: false, message: "Username/email and password are required." });
    }

    const isAdminAlias =
      identifier === "admin" ||
      identifier === "hangu_admin" ||
      identifier === "admin@hangubrandedshoes.com";

    const admin = await Admin.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        ...(isAdminAlias
          ? [
              { username: "hangu_admin" },
              { username: "admin" },
              { email: "admin@hangubrandedshoes.com" },
            ]
          : []),
      ],
    });

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

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id.toString(), admin.role);

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
      },
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
}
