import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Inquiry } from "../models/Inquiry.js";
import { Subscriber } from "../models/Subscriber.js";

export async function getDashboard(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const orders = await Order.find();
    const products = await Product.find();
    const inquiries = await Inquiry.find();
    const subscribers = await Subscriber.find();

    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalOrders = orders.length;

    // Total revenue excluding cancelled
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
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

    const unreadInquiries = inquiries.filter((i) => i.status === "new").length;
    const subscriberCount = subscribers.filter((s) => s.isActive).length;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        lowStockCount,
        todayOrders,
        subscriberCount,
        unreadInquiries,
      },
      lowStockItems,
      recentOrders,
      recentInquiries,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

