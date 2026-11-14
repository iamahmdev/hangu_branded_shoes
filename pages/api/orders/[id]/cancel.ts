import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../src/lib/dbConnect";
import Order from "../../../../src/models/Order";
import Product from "../../../../src/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH" && req.method !== "POST") {
    res.setHeader("Allow", ["PATCH", "POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await dbConnect();

    const { id } = req.query;
    const { reason } = req.body || {};

    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Order ID is required." });
    }

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

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
    for (const item of order.items) {
      if (item.productId) {
        await Product.updateOne({ id: Number(item.productId) }, { $inc: { stock: Number(item.quantity) } });
      }
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = reason || "Cancelled by customer/admin";
    order.timeline = order.timeline || [];
    order.timeline.push({
      status: "cancelled",
      timestamp: new Date(),
      note: reason || "Cancelled and inventory stock restored",
    });

    await order.save();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order cancelled successfully and stock restored.",
    });
  } catch (error: any) {
    console.error("Order cancel error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
}
