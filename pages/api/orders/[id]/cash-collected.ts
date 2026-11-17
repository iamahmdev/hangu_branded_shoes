import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../src/lib/dbConnect";
import Order from "../../../../src/models/Order";
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

    const { note } = req.body || {};

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

    order.paymentStatus = "paid";
    order.status = "delivered";
    (order as any).paidAt = new Date();
    order.timeline.push({
      status: "delivered",
      timestamp: new Date(),
      note: note || "Cash collected from customer upon delivery. Order completed.",
    });

    await order.save();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Cash marked as collected and order marked as delivered.",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to mark cash collected" });
  }
}
