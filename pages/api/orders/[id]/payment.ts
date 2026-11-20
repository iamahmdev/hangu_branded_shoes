import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedOrder } from "../../../../src/lib/unifiedDb";
import { verifyToken } from "../../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH" && req.method !== "PUT") {
    res.setHeader("Allow", ["PATCH", "PUT"]);
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
    const { paymentStatus } = req.body || {};

    if (!paymentStatus) {
      return res.status(400).json({ success: false, message: "paymentStatus is required" });
    }

    const order = await UnifiedOrder.findByOrderId(String(id));
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const updated = await UnifiedOrder.updatePaymentStatus(order.orderId, paymentStatus);

    return res.status(200).json({
      success: true,
      data: updated,
      message: `Payment status updated to ${paymentStatus}`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to update payment status" });
  }
}
