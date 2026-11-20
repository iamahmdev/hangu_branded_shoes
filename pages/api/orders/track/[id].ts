import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedOrder } from "../../../../src/lib/unifiedDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Order ID or phone number is required" });
  }

  const clean = id.trim().toLowerCase();

  try {
    const orders = await UnifiedOrder.findAll(200);
    const order = orders.find((o: any) => {
      const oId = (o.orderId || "").toLowerCase();
      const phone = (o.customer?.phone || "").toLowerCase();
      const cleanPhone = phone.replace(/^0/, "92");
      const zeroPhone = phone.replace(/^92/, "0");
      return (
        oId === clean ||
        phone === clean ||
        cleanPhone === clean ||
        zeroPhone === clean
      );
    });

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
