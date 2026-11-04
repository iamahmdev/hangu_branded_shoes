import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin, IAdmin } from "../models/Admin.js";

export interface AuthRequest extends Request {
  admin?: IAdmin;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Authentication required. Bearer token missing." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "hangu_branded_shoes_super_secret_jwt_key_2026";
    
    const decoded = jwt.verify(token, secret) as { id: string; role?: string };
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      res.status(401).json({ success: false, message: "User not found or account is deactivated." });
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    if (roles.length > 0 && !roles.includes(req.admin.role)) {
      res.status(403).json({ success: false, message: "Access forbidden. Insufficient permissions." });
      return;
    }

    next();
  };
}

