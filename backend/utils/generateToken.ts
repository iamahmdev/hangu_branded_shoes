import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hangu_branded_shoes_super_secret_jwt_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate secure JWT token for Admin authentication
 * @param adminId - Admin MongoDB _id string
 * @param role - Admin role (e.g. 'admin', 'manager')
 * @returns Signed JWT string
 */
export function generateToken(adminId: string, role: string = "admin"): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
  };

  return jwt.sign({ id: adminId, role }, JWT_SECRET, options);
}

/**
 * Verify and decode a JWT token
 * @param token - Bearer token string
 */
export function verifyToken(token: string): { id: string; role?: string } {
  return jwt.verify(token, JWT_SECRET) as { id: string; role?: string };
}

export default generateToken;

