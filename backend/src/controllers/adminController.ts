import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export async function getDashboard(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const orders = await Order.find();
    const products = await Product.find();

    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const pendingPaymentsCount = orders.filter((o) => o.paymentStatus === "pending_verification").length;
    const totalOrders = orders.length;

    // Total revenue excluding cancelled
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled" && o.paymentStatus === "paid")
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => new Date((o as any).createdAt) >= startOfToday).length;

    const lowStockItems = products
      .filter((p) => p.stock <= 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        stockCount: p.stock,
        img: p.img,
        cat: p.cat,
        price: p.price,
      }));
    const lowStockCount = lowStockItems.length;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        pendingPaymentsCount,
        lowStockCount,
        todayOrders,
      },
      lowStockItems,
      recentOrders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
