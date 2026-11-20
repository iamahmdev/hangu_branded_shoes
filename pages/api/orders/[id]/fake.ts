import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedOrder, UnifiedProduct, UnifiedSetting } from "../../../../src/lib/unifiedDb";
import { verifyToken } from "../../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH" && req.method !== "POST" && req.method !== "PUT") {
    res.setHeader("Allow", ["PATCH", "POST", "PUT"]);
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

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const { blockPhone = true, reason = "Marked as fake / unreachable" } = req.body || {};

    const order = await UnifiedOrder.findByOrderId(String(id));

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "cancelled") {
      // Restore inventory stock
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.productId) {
            const prod = await UnifiedProduct.findById(item.productId);
            if (prod) {
              await UnifiedProduct.update(item.productId, {
                stock: (prod.stock || 0) + Number(item.quantity || 1),
              });
            }
          }
        }
      }

      await UnifiedOrder.updateStatus(order.orderId, "cancelled", `Fake/Spam Order: ${reason}`);
    }

    // Add phone to blocked list if requested
    if (blockPhone && order.customer?.phone) {
      const cleanPhone = String(order.customer.phone).trim();
      const settings = await UnifiedSetting.get();
      const blocked = settings?.blockedPhoneNumbers || [];
      if (!blocked.includes(cleanPhone)) {
        await UnifiedSetting.update({
          blockedPhoneNumbers: [...blocked, cleanPhone],
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Order #${order.orderId} marked as fake, cancelled, inventory restored, and customer phone blocked.`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to mark order as fake" });
  }
}
