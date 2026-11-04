import { Request, Response } from "express";
import crypto from "crypto";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Setting } from "../models/Setting.js";

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const {
      customer,
      items,
      transactionId,
      paymentScreenshot,
      notes,
    } = req.body;

    // Validate customer details
    if (!customer || !customer.name || !customer.phone || !customer.city || !customer.address) {
      res.status(400).json({ success: false, message: "Complete customer information is required." });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "Order must contain at least one item." });
      return;
    }

    // EasyPaisa TID validation & duplicate check
    const cleanTid = String(transactionId || "").trim();
    if (!cleanTid || cleanTid.length < 5) {
      res.status(400).json({
        success: false,
        message: "Valid EasyPaisa Transaction ID (TID) is required to place your order.",
      });
      return;
    }

    // Security check: Block duplicate TIDs
    const existingOrderWithTid = await Order.findOne({
      transactionId: { $regex: new RegExp(`^${cleanTid}$`, "i") },
    });
    if (existingOrderWithTid) {
      res.status(400).json({
        success: false,
        message: "This EasyPaisa Transaction ID (TID) has already been submitted for another order. Duplicate TIDs are rejected.",
      });
      return;
    }

    // Security check: Calculate order totals strictly on the server from DB
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        res.status(400).json({ success: false, message: "Invalid item in cart." });
        return;
      }

      const product = await Product.findOne({ id: Number(item.productId) });
      if (!product) {
        res.status(404).json({ success: false, message: `Product #${item.productId} not found.` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} pair(s) remaining.`,
        });
        return;
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        img: product.img,
        price: product.price,
        size: String(item.size || "41"),
        quantity: item.quantity,
        total: itemTotal,
      });

      // Decrement inventory stock atomically
      await Product.updateOne({ id: product.id }, { $inc: { stock: -item.quantity } });
    }

    // Fetch dynamic store shipping settings from DB
    const storeSettings = await Setting.findOne();
    const standardFee = storeSettings?.shippingFee ?? 250;
    const freeThreshold = storeSettings?.freeShippingThreshold ?? 5000;

    const shippingFee = calculatedSubtotal >= freeThreshold ? 0 : standardFee;
    const totalAmount = calculatedSubtotal + shippingFee;

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
      totalAmount,
      paymentMethod: "easypaisa",
      paymentStatus: "pending_verification",
      transactionId: cleanTid,
      paymentScreenshot: paymentScreenshot ? String(paymentScreenshot).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      status: "pending",
      timeline: [
        {
          status: "pending",
          timestamp: new Date(),
          note: `Order placed via EasyPaisa (TID: ${cleanTid}). Pending payment verification.`,
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: order,
      orderId: order.orderId,
      message: "Order placed successfully! Please send payment screenshot via WhatsApp for instant confirmation.",
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
    const { reason } = req.body;

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.status === "dispatched" || order.status === "delivered") {
      res.status(400).json({
        success: false,
        message: "Cannot cancel order after dispatch or delivery. Please contact store concierge on WhatsApp.",
      });
      return;
    }

    if (order.status === "cancelled") {
      res.status(400).json({ success: false, message: "Order is already cancelled." });
      return;
    }

    // Restore inventory stock
    for (const item of order.items) {
      await Product.updateOne({ id: item.productId }, { $inc: { stock: item.quantity } });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = reason || "Cancelled by customer";
    order.timeline.push({
      status: "cancelled",
      timestamp: new Date(),
      note: reason || "Cancelled by customer",
    });

    await order.save();

    res.json({
      success: true,
      data: order,
      message: "Order cancelled successfully and stock restored.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const { status, paymentStatus, search } = req.query;
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (paymentStatus && paymentStatus !== "all") {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      const s = String(search).trim();
      filter.$or = [
        { orderId: { $regex: s, $options: "i" } },
        { transactionId: { $regex: s, $options: "i" } },
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

    // Business Constraint: An order can be confirmed ONLY after payment is "paid"
    if (status === "confirmed" && order.paymentStatus !== "paid") {
      res.status(400).json({
        success: false,
        message: "Order cannot be confirmed until payment status is marked as 'paid'. Please verify customer EasyPaisa transfer first.",
      });
      return;
    }

    if (status) {
      order.status = status;
      order.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`,
      });
    }

    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    res.json({ success: true, data: order, message: "Order status updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateOrderPaymentStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { paymentStatus, note } = req.body;

    if (!paymentStatus || !["pending_verification", "paid", "rejected"].includes(paymentStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid payment status. Must be 'pending_verification', 'paid', or 'rejected'.",
      });
      return;
    }

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    order.paymentStatus = paymentStatus;
    order.timeline.push({
      status: `payment_${paymentStatus}`,
      timestamp: new Date(),
      note: note || `Payment marked as ${paymentStatus}`,
    });

    await order.save();

    res.json({
      success: true,
      data: order,
      message: `Payment status updated to ${paymentStatus}`,
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
          maskedName = `${parts[0]} ${parts[1][0]}.`;
        }
      }

      if (order.items && order.items.length > 0) {
        const first = order.items[0];
        recentSales.push({
          id: String(order._id),
          customerName: maskedName,
          city: order.customer?.city || "Pakistan",
          productId: first.productId,
          name: first.name,
          img: first.img,
          price: first.price,
          size: first.size,
          createdAt: (order as any).createdAt ? (order as any).createdAt.toISOString() : new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, count: recentSales.length, data: recentSales });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
