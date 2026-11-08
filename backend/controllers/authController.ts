import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Admin } from "../models/Admin.js";
import { AuthRequest } from "../middleware/auth.js";

function generateToken(adminId: string, role: string): string {
  const secret = process.env.JWT_SECRET || "hangu_branded_shoes_super_secret_jwt_key_2026";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: adminId, role }, secret, { expiresIn } as jwt.SignOptions);
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { usernameOrEmail, username, email, password } = req.body;
    const identifier = (usernameOrEmail || username || email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!identifier || !cleanPassword) {
      res.status(400).json({ success: false, message: "Username/email and password are required." });
      return;
    }

    // Flexible identifier matching: matches exact username, email, or master admin aliases
    const isAdminAlias = identifier === "admin" || identifier === "hangu_admin" || identifier === "admin@hangubrandedshoes.com";
    const admin = await Admin.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        ...(isAdminAlias ? [{ username: "hangu_admin" }, { username: "admin" }, { email: "admin@hangubrandedshoes.com" }] : []),
      ],
    });

    if (!admin) {
      res.status(401).json({ success: false, message: "Invalid credentials." });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({ success: false, message: "Your account is deactivated. Contact administrator." });
      return;
    }

    const isMatch = await admin.comparePassword(cleanPassword);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials." });
      return;
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id.toString(), admin.role);

    res.json({
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
    res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password, name, role } = req.body;

    if (!username || !email || !password || !name) {
      res.status(400).json({ success: false, message: "All fields are required." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
      return;
    }

    const existing = await Admin.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existing) {
      res.status(409).json({ success: false, message: "Username or email already in use." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: "admin",
      permissions: ["*"],
    });

    const token = generateToken(admin._id.toString(), admin.role);

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      message: "User registered successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Registration failed" });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const admin = req.admin;
    if (!admin) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const admin = req.admin;
    if (!admin) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { name, email } = req.body;
    if (name) admin.name = name.trim();
    if (email) {
      const emailLower = email.trim().toLowerCase();
      const existing = await Admin.findOne({ email: emailLower, _id: { $ne: admin._id } });
      if (existing) {
        res.status(409).json({ success: false, message: "Email is already taken by another account." });
        return;
      }
      admin.email = emailLower;
    }

    await admin.save();

    res.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const admin = req.admin;
    if (!admin) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: "Current password and new password are required." });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
      return;
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Current password does not match." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required." });
      return;
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      // Don't leak user existence
      res.json({ success: true, message: "If an account exists, a reset instructions token was generated." });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await admin.save();

    const isTest = process.env.NODE_ENV === "test";
    res.json({
      success: true,
      ...(isTest ? { resetToken } : {}),
      message: "If an account exists, a reset instructions token was generated.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      res.status(400).json({ success: false, message: "Reset token and new password are required." });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!admin) {
      res.status(400).json({ success: false, message: "Invalid or expired password reset token." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({ success: true, message: "Password has been reset successfully. You can now login." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function recoverPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email, recoveryKey, newPassword } = req.body;
    if (!email || !recoveryKey || !newPassword) {
      res.status(400).json({ success: false, message: "Email, recovery key, and new password are required." });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
      return;
    }

    const masterKey = process.env.STORE_RECOVERY_KEY || "HANGU-SECURE-2026";
    if (recoveryKey.trim() !== masterKey) {
      res.status(401).json({ success: false, message: "Invalid Store Recovery Key. Access denied." });
      return;
    }

    const admin = await Admin.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: email.trim().toLowerCase() },
      ],
    });

    if (!admin) {
      res.status(404).json({ success: false, message: "No admin account found matching that email or username." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({
      success: true,
      message: "Admin password successfully reset! You can now log in with your new password.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await Admin.find().select("-passwordHash -resetPasswordToken -resetPasswordExpires").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateUserRole(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { role, isActive, permissions } = req.body;

    const user = await Admin.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (role === "admin") {
      user.role = "admin";
    }
    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }
    if (Array.isArray(permissions)) {
      user.permissions = permissions;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        permissions: user.permissions,
      },
      message: "User updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

