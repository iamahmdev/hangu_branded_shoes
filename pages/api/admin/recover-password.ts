import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "../../../src/lib/dbConnect";
import { Admin } from "../../../src/models/Admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { email, recoveryKey, newPassword } = req.body || {};
    if (!email || !recoveryKey || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, recovery key, and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
    }

    const masterKey = process.env.STORE_RECOVERY_KEY || "HANGU-SECURE-2026";
    if (recoveryKey.trim() !== masterKey) {
      return res.status(401).json({ success: false, message: "Invalid Store Recovery Key. Access denied." });
    }

    await dbConnect();
    const admin = await Admin.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: email.trim().toLowerCase() },
      ],
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: "No admin account found matching that email or username." });
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin password successfully reset! You can now log in with your new password.",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Password recovery failed" });
  }
}
