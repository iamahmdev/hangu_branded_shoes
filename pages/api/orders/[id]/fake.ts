import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../src/lib/dbConnect";
import Order from "../../../../src/models/Order";
import Product from "../../../../src/models/Product";
import Setting from "../../../../src/models/Setting";
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

    await dbConnect();
    const idStr = String(id);
    const order = await Order.findOne({
      $or: [
        { orderId: idStr },
        { _id: idStr.match(/^[0-9a-fA-F]{24}$/) ? idStr : null },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "cancelled") {
      // Restore inventory stock
      for (const item of order.items) {
        await Product.updateOne({ id: item.productId }, { $inc: { stock: item.quantity } });
      }

      order.status = "cancelled";
      order.cancelledAt = new Date();
      order.cancelReason = reason;
      order.timeline.push({
        status: "cancelled",
        timestamp: new Date(),
        note: `Cancelled: ${reason}`,
      });
      await order.save();
    }

    // Add phone to blocked list if requested
    let phoneBlocked = false;
    if (blockPhone && order.customer?.phone) {
      const cleanPhone = order.customer.phone.trim();
      const setting = await Setting.findOne();
      if (setting) {
        if (!setting.blockedPhoneNumbers.includes(cleanPhone)) {
          setting.blockedPhoneNumbers.push(cleanPhone);
          await setting.save();
          phoneBlocked = true;
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: order,
      phoneBlocked,
      message: `Order #${order.orderId} marked as fake and cancelled. Product stock restored.${phoneBlocked ? " Customer phone added to blocklist." : ""}`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to mark order as fake" });
  }
}
