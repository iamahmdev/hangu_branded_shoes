import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../src/lib/dbConnect";
import Order from "../../../../src/models/Order";
import { verifyToken } from "../../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: "Order ID is required" });
  }

  const idStr = String(id).trim();
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idStr);
  const filter = isObjectId
    ? { $or: [{ orderId: idStr }, { _id: idStr }] }
    : { orderId: idStr };

  if (req.method === "DELETE") {
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

      await dbConnect();
      const deleted = await Order.findOneAndDelete(filter);

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Order not found to delete" });
      }

      return res.status(200).json({ success: true, message: `Order #${deleted.orderId || idStr} deleted successfully` });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to delete order" });
    }
  }

  if (req.method === "GET") {
    try {
      await dbConnect();
      const order = await Order.findOne(filter).lean();

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to fetch order" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
