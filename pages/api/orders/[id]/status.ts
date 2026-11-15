import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../src/lib/dbConnect";
import Order from "../../../../src/models/Order";
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
    if (!id) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const { status, courierName, trackingNumber, deliveryNote, note } = req.body || {};

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

    if (
      status === "confirmed" &&
      (order.paymentMethod === "easypaisa" || order.paymentMethod === "jazzcash") &&
      order.paymentStatus !== "paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be confirmed until payment status is marked as 'paid'. Please verify customer JazzCash transfer first.",
      });
    }

    if (status) {
      order.status = status;
      order.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`,
      });
    }

    if (courierName !== undefined) order.courierName = courierName;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;

    await order.save();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update order" });
  }
}
