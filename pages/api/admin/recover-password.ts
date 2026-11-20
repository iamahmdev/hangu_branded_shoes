import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { UnifiedAdmin } from "../../../src/lib/unifiedDb";
import { sendPasswordResetAlert } from "../../../src/lib/email";

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

    const admin = await UnifiedAdmin.findByUsername(email.trim().toLowerCase());

    if (!admin) {
      return res.status(404).json({ success: false, message: "No admin account found matching that email or username." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await UnifiedAdmin.updatePassword(admin.id, passwordHash);

    // Send professional Hostinger SMTP email alert to admin
    const targetEmail = admin.email || process.env.ADMIN_EMAIL || "info@hangubrandedshoes.com";
    try {
      await sendPasswordResetAlert(targetEmail, admin.username || "Admin", "RECOVERED");
    } catch (mailErr: any) {
      console.warn("Could not dispatch email notification (non-fatal):", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password has been successfully reset. You can now login with your new password.",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to reset password" });
  }
}
