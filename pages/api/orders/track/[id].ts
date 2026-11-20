import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedOrder } from "../../../../src/lib/unifiedDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Order ID or phone number is required" });
  }

  const queryRaw = id.trim().toLowerCase();
  const queryDigits = queryRaw.replace(/\D/g, ""); // extract only numeric digits e.g. 03359348844 -> 3359348844

  try {
    const orders = await UnifiedOrder.findAll(500);
    const order = orders.find((o: any) => {
      const oId = (o.orderId || "").toLowerCase();
      const phone = (o.customer?.phone || "").toLowerCase();
      const phoneDigits = phone.replace(/\D/g, "");

      // 1. Direct Order ID match (full or partial e.g. HBS-261120-84CCE0 or 84CCE0 or numeric id)
      if (oId === queryRaw || oId.replace(/-/g, "") === queryRaw.replace(/-/g, "") || String(o.id) === queryRaw) {
        return true;
      }
      if (queryRaw.length >= 6 && oId.includes(queryRaw)) {
        return true;
      }

      // 2. Flexible phone number matching (e.g. 03359348844, +923359348844, 923359348844)
      if (queryDigits && queryDigits.length >= 7) {
        const qLast9 = queryDigits.slice(-9);
        const pLast9 = phoneDigits.slice(-9);
        if (qLast9 === pLast9) {
          return true;
        }
      }

      return false;
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
