import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import Order from "../../../src/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const orders = await Order.find({ status: { $ne: "cancelled" } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentSales = orders.flatMap((o: any) =>
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
