import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { UnifiedAdmin } from "../../../src/lib/unifiedDb";
import { verifyToken } from "../../../src/lib/jwt";
import { sendPasswordResetAlert } from "../../../src/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
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

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
    }

    const admin = await UnifiedAdmin.findByUsername("admin");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password does not match." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await UnifiedAdmin.updatePassword(admin.id, passwordHash);

    // Send professional Hostinger SMTP email alert to admin
    const targetEmail = admin.email || process.env.ADMIN_EMAIL || "info@hangubrandedshoes.com";
    try {
      await sendPasswordResetAlert(targetEmail, admin.username || "Admin", "CHANGED");
    } catch (mailErr: any) {
      console.warn("Could not dispatch email notification (non-fatal):", mailErr.message);
    }

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update password" });
  }
}
