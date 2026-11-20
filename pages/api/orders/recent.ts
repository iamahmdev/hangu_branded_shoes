import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedOrder } from "../../../src/lib/unifiedDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const orders = await UnifiedOrder.findAll(15);
    const validOrders = orders.filter((o: any) => o.status !== "cancelled");

    const recentSales = validOrders.flatMap((o: any) =>
      (o.items || []).map((item: any, idx: number) => ({
        id: `${o.orderId}-${idx}`,
        customerName: o.customer?.name || "Customer",
        city: o.customer?.city || "Pakistan",
        productId: item.productId,
        name: item.name,
        img: item.img,
        price: item.price,
        size: item.size,
        createdAt: o.createdAt || new Date().toISOString(),
      }))
    );

    return res.status(200).json({ success: true, data: recentSales.slice(0, 8) });
  } catch {
    return res.status(200).json({ success: true, data: [] });
  }
}
