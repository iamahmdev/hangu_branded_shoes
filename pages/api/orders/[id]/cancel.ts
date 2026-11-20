import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedOrder, UnifiedProduct } from "../../../../src/lib/unifiedDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH" && req.method !== "POST") {
    res.setHeader("Allow", ["PATCH", "POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id } = req.query;
    const { reason } = req.body || {};

    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Order ID is required." });
    }

    const order = await UnifiedOrder.findByOrderId(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.status === "dispatched" || order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order after dispatch or delivery.",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled.",
      });
    }

    // Restore stock for all items
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

    const note = reason ? `Customer cancelled: ${reason}` : "Cancelled by customer";
    await UnifiedOrder.updateStatus(order.orderId, "cancelled", note);

    return res.status(200).json({
      success: true,
      message: "Your order has been cancelled successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to cancel order" });
  }
}
