import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../src/lib/dbConnect";
import Order from "../../../../src/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Order ID or phone number is required" });
  }

  const clean = id.trim();

  try {
    await dbConnect();
    // Search by orderId or customer phone number
    const order = await Order.findOne({
      $or: [
        { orderId: clean },
        { orderId: clean.toUpperCase() },
        { "customer.phone": clean },
        { "customer.phone": clean.replace(/^0/, "92") },
        { "customer.phone": clean.replace(/^92/, "0") },
      ],
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found matching this Order ID or Phone Number.",
      });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to search order" });
  }
}
