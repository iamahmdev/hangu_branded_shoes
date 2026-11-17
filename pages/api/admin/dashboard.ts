import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import Order from "../../../src/models/Order";
import Product from "../../../src/models/Product";
import { verifyToken } from "../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
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

    await dbConnect();
    const orders = await Order.find().lean();
    const products = await Product.find().lean();

    const deliveredOrders = orders.filter((o: any) => o.status === "delivered").length;
    const pendingOrders = orders.filter(
      (o: any) => o.status === "pending" || o.status === "awaiting_confirmation"
    ).length;
    const pendingPaymentsCount = orders.filter(
      (o: any) =>
        (o.paymentMethod === "easypaisa" || o.paymentMethod === "jazzcash") &&
        o.paymentStatus === "pending_verification" &&
        o.status !== "cancelled" &&
        o.status !== "delivered"
    ).length;
    const codPendingCount = orders.filter(
      (o: any) =>
        o.paymentMethod === "cod" &&
        o.paymentStatus === "cod_pending" &&
        o.status !== "cancelled" &&
        o.status !== "delivered"
    ).length;
    const totalOrders = orders.length;

    const totalRevenue = orders
      .filter((o: any) => o.status !== "cancelled" && o.paymentStatus === "paid")
      .reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o: any) => new Date(o.createdAt) >= startOfToday).length;

    const lowStockItems = products
      .filter((p: any) => p.stock <= 10)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        stockCount: p.stock,
        img: p.img,
        cat: p.cat,
        price: p.price,
      }));
    const lowStockCount = lowStockItems.length;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6).lean();

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        pendingPaymentsCount,
        codPendingCount,
        lowStockCount,
        todayOrders,
      },
      lowStockItems,
      recentOrders,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to load dashboard" });
  }
}
