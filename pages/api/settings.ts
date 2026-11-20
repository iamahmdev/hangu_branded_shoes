import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedSetting } from "../../src/lib/unifiedDb";
import { verifyToken } from "../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT" || req.method === "PATCH") {
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

      const updated = await UnifiedSetting.update(req.body);

      return res.status(200).json({ success: true, data: updated, message: "Settings updated successfully" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to update settings" });
    }
  }

  if (req.method === "GET") {
    try {
      const settings = await UnifiedSetting.get();
      if (settings) {
        return res.status(200).json({ success: true, data: settings });
      }
    } catch (e) {
      // fallback
    }

    return res.status(200).json({
      success: true,
      data: {
        storeName: "Hangu Branded Shoes",
        whatsappNumber: "923333147691",
        address: "Hangu tall road tahir markit hangu brand shoes 👟",
        shopTiming: "8:00 AM to 5:00 PM",
        phone: "+92 333 3147691",
        email: "info@hangubrandedshoes.com",
        shippingFee: 250,
        freeShippingThreshold: 5000,
        announcementText: "🚚 Free delivery on orders over Rs. 5,000 across Pakistan!",
        isStoreOpen: true,
        jazzcashNumber: "03275430305",
        jazzcashTitle: "Muhammad Atif Ibrahim",
        easypaisaNumber: "",
        easypaisaTitle: "",
        enableCod: true,
        codFee: 0,
      },
    });
  }

  res.setHeader("Allow", ["GET", "PUT", "PATCH"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
