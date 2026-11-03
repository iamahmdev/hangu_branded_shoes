import { Request, Response } from "express";
import crypto from "crypto";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const {
      customer,
      items,
      paymentMethod = "cod",
      transactionId,
      couponCode,
      notes,
    } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.city || !customer.address) {
      res.status(400).json({ success: false, message: "Complete customer information is required." });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "Order must contain at least one item." });
      return;
    }

    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        res.status(400).json({ success: false, message: "Invalid item in cart." });
        return;
      }

      const product = await Product.findOne({ id: Number(item.productId) });
      if (!product) {
        res.status(404).json({ success: false, message: `Product ${item.name || item.productId} not found.` });
        return;
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        img: product.img,
        price: product.price,
        size: item.size || "41",
        quantity: item.quantity,
        total: itemTotal,
      });

      // Decrement stock atomically
      await Product.updateOne({ id: product.id }, { $inc: { stock: -item.quantity } });
    }

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase().trim(), isActive: true });
      if (coupon && calculatedSubtotal >= coupon.minOrderAmount) {
        discountAmount = Math.round((calculatedSubtotal * coupon.discountPercent) / 100);
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    const shippingFee = calculatedSubtotal >= 5000 ? 0 : 250;
    const totalAmount = Math.max(0, calculatedSubtotal + shippingFee - discountAmount);

    const generatedOrderId =
      req.body.orderId ||
      `HBS-${new Date().getFullYear()}-${crypto.randomInt(1000, 9999)}`;

    const order = await Order.create({
      orderId: generatedOrderId,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        city: customer.city.trim(),
        address: customer.address.trim(),
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingFee,
      discountAmount,
      couponCode: couponCode ? String(couponCode).toUpperCase().trim() : undefined,
      totalAmount,
      paymentMethod,
      transactionId,
      notes,
      status: "pending",
      timeline: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order placed successfully. Waiting for phone confirmation.",
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: order,
      orderId: order.orderId,
      message: "Order placed successfully! We will call you for confirmation.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function trackOrder(req: Request, res: Response): Promise<void> {
  try {
    const { orderId, phone } = req.query;

    if (!orderId && !phone) {
      res.status(400).json({ success: false, message: "Order ID or Phone number is required for tracking." });
      return;
    }

    const filter: any = {};
    if (orderId) {
      filter.orderId = { $regex: new RegExp(`^${String(orderId).trim()}$`, "i") };
    }
    if (phone) {
      filter["customer.phone"] = { $regex: new RegExp(String(phone).trim().slice(-7)) };
    }

    const order = await Order.findOne(filter).sort({ createdAt: -1 });

    if (!order) {
      res.status(404).json({ success: false, message: "No matching order found with the provided details." });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { reason = "Customer requested cancellation" } = req.body;

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (["dispatched", "delivered"].includes(order.status)) {
      res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status}. Contact customer support.`,
      });
      return;
    }

    if (order.status === "cancelled") {
      res.status(400).json({ success: false, message: "Order is already cancelled." });
      return;
    }

    // Restore item stocks
    for (const item of order.items) {
      await Product.updateOne({ id: item.productId }, { $inc: { stock: item.quantity } });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    order.timeline.push({
      status: "cancelled",
      timestamp: new Date(),
      note: `Order cancelled. Reason: ${reason}`,
    });

    await order.save();

    res.json({ success: true, data: order, message: "Order cancelled successfully and stock restored." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      const s = String(search).trim();
      filter.$or = [
        { orderId: { $regex: s, $options: "i" } },
        { "customer.name": { $regex: s, $options: "i" } },
        { "customer.phone": { $regex: s, $options: "i" } },
        { "customer.city": { $regex: s, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, courierName, trackingNumber, note } = req.body;

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (status) {
      order.status = status;
      order.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status}`,
      });
    }

    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    res.json({ success: true, data: order, message: "Order updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getRecentPublicSales(req: Request, res: Response): Promise<void> {
  try {
    const orders = await Order.find({ status: { $ne: "cancelled" } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("customer.name customer.city items createdAt");

    const recentSales: Array<{
      id: string;
      customerName: string;
      city: string;
      productId: number;
      name: string;
      img: string;
      price: number;
      size: string;
      createdAt: string;
    }> = [];

    for (const order of orders) {
      const rawName = order.customer?.name?.trim() || "";
      let maskedName = "Someone";
      if (rawName) {
        const parts = rawName.split(/\s+/);
        if (parts.length === 1) {
          maskedName = parts[0];
        } else {
          const first = parts[0];
          const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || "";
          maskedName = lastInitial ? `${first} ${lastInitial}.` : first;
        }
      }

      const city = order.customer?.city?.trim() || "Pakistan";

      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          recentSales.push({
            id: `${order._id}-${item.productId}-${item.size || "default"}`,
            customerName: maskedName,
            city,
            productId: item.productId,
            name: item.name,
            img: item.img,
            price: item.price,
            size: item.size || "42",
            createdAt: order.createdAt ? order.createdAt.toISOString() : new Date().toISOString(),
          });
        }
      }
    }

    res.json({
      success: true,
      count: recentSales.length,
      data: recentSales.slice(0, 10),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

