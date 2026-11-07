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
      paymentMethod = "cod",
      transactionId,
      paymentScreenshot,
      notes,
      hp,
      website,
    } = req.body;

    // 1. Honeypot check for automated bot protection
    if (hp || website) {
      res.status(400).json({ success: false, message: "Bot activity detected." });
      return;
    }

    // 2. Validate customer information presence
    if (!customer || !customer.name || !customer.phone || !customer.city || !customer.address) {
      res.status(400).json({ success: false, message: "Complete customer information is required." });
      return;
    }

    // 3. Delivery address minimum length check (at least 10 characters)
    const cleanAddress = String(customer.address).trim();
    if (cleanAddress.length < 10) {
      res.status(400).json({
        success: false,
        message: "Please provide a complete delivery address (at least 10 characters with house/street details).",
      });
      return;
    }

    // 4. Strict Pakistani phone number validation
    const rawPhone = String(customer.phone).trim();
    const digitsOnly = rawPhone.replace(/\D/g, "");
    const isValidPakistaniMobile = /^(03\d{9}|923\d{9})$/.test(digitsOnly);

    if (!isValidPakistaniMobile) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid Pakistani mobile number (e.g. 0333-1234567).",
      });
      return;
    }

    const normalizedPhone = digitsOnly.startsWith("92") ? "0" + digitsOnly.slice(2) : digitsOnly;

    // 5. Check if phone number is on the admin blocked list
    const storeSettings = await Setting.findOne();
    if (storeSettings?.blockedPhoneNumbers && Array.isArray(storeSettings.blockedPhoneNumbers)) {
      const isBlocked = storeSettings.blockedPhoneNumbers.some((bp) => {
        const cleanBp = bp.replace(/\D/g, "");
        return cleanBp && (digitsOnly.includes(cleanBp) || cleanBp.includes(digitsOnly.slice(-9)));
      });

      if (isBlocked) {
        res.status(403).json({
          success: false,
          message: "This phone number is restricted from placing orders. Please contact customer support directly on WhatsApp.",
        });
        return;
      }
    }

    // 6. Fake Order Rate Limiting (24 Hours Window)
    const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const phoneSuffix = digitsOnly.slice(-9);

    // At most 3 orders per phone number per 24 hours
    const recentPhoneOrdersCount = await Order.countDocuments({
      "customer.phone": { $regex: phoneSuffix },
      createdAt: { $gte: past24Hours },
      status: { $ne: "cancelled" },
    });

    if (recentPhoneOrdersCount >= 3) {
      res.status(429).json({
        success: false,
        message: "Daily order limit reached (maximum 3 orders per phone number in 24 hours). Please contact support on WhatsApp.",
      });
      return;
    }

    // At most 5 orders per IP address per 24 hours
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "::1") {
      const recentIpOrdersCount = await Order.countDocuments({
        customerIp: clientIp,
        createdAt: { $gte: past24Hours },
        status: { $ne: "cancelled" },
      });

      if (recentIpOrdersCount >= 5) {
        res.status(429).json({
          success: false,
          message: "Daily order limit reached from this network (maximum 5 orders per 24 hours). Please contact support on WhatsApp.",
        });
        return;
      }
    }

    // 7. Validate payment method ("cod" or "jazzcash")
    const method = String(paymentMethod).toLowerCase().trim();
    if (method !== "cod" && method !== "easypaisa" && method !== "jazzcash") {
      res.status(400).json({
        success: false,
        message: "Invalid payment method. Only Cash on Delivery ('cod') and JazzCash ('jazzcash') are supported.",
      });
      return;
    }

    if (method === "cod" && storeSettings && storeSettings.enableCod === false) {
      res.status(400).json({
        success: false,
        message: "Cash on Delivery is currently disabled by store management. Please select JazzCash or contact WhatsApp.",
      });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "Order must contain at least one item." });
      return;
    }

    // 8. Payment Method Specific Validation
    let cleanTid = "";
    let orderPaymentStatus: "cod_pending" | "pending_verification" = "cod_pending";
    let orderStatus: "awaiting_confirmation" | "pending" = "awaiting_confirmation";
    let codFee = 0;

    if (method === "easypaisa" || method === "jazzcash") {
      cleanTid = String(transactionId || "").trim();
      if (!cleanTid || cleanTid.length < 5) {
        res.status(400).json({
          success: false,
          message: "Valid JazzCash Transaction ID (TID) is required to place your order.",
        });
        return;
      }

      // Block duplicate TIDs for JazzCash
      const existingOrderWithTid = await Order.findOne({
        transactionId: { $regex: new RegExp(`^${cleanTid}$`, "i") },
      });
      if (existingOrderWithTid) {
        res.status(400).json({
          success: false,
          message: "This JazzCash Transaction ID (TID) has already been submitted for another order. Duplicate TIDs are rejected.",
        });
        return;
      }

      orderPaymentStatus = "pending_verification";
      orderStatus = "pending";
    } else {
      // Cash on Delivery
      orderPaymentStatus = "cod_pending";
      orderStatus = "awaiting_confirmation";
      cleanTid = `COD-${Date.now().toString().slice(-6)}`;
      codFee = storeSettings?.codFee ?? 0;
    }

    // 9. Calculate order totals strictly on the server from DB
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

      // Atomic inventory stock decrement
      await Product.updateOne({ id: product.id }, { $inc: { stock: -item.quantity } });
    }

    const standardFee = storeSettings?.shippingFee ?? 250;
    const freeThreshold = storeSettings?.freeShippingThreshold ?? 5000;
    const shippingFee = calculatedSubtotal >= freeThreshold ? 0 : standardFee;
    const totalAmount = calculatedSubtotal + shippingFee + codFee;

    const generatedOrderId =
      req.body.orderId ||
      `HBS-${new Date().getFullYear()}-${crypto.randomInt(1000, 9999)}`;

    const order = await Order.create({
      orderId: generatedOrderId,
      customer: {
        name: customer.name.trim(),
        phone: normalizedPhone,
        city: customer.city.trim(),
        address: cleanAddress,
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingFee,
      codFee,
      totalAmount,
      paymentMethod: method,
      paymentStatus: orderPaymentStatus,
      transactionId: cleanTid,
      paymentScreenshot: paymentScreenshot ? String(paymentScreenshot).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      customerIp: clientIp,
      status: orderStatus,
      timeline: [
        {
          status: orderStatus,
          timestamp: new Date(),
          note:
            method === "cod"
              ? "Order placed via Cash on Delivery. Stock reserved, awaiting shop confirmation call/WhatsApp."
              : `Order placed via JazzCash (TID: ${cleanTid}). Pending payment verification.`,
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: order,
      orderId: order.orderId,
      message:
        method === "cod"
          ? "Order placed successfully! We will confirm your order via WhatsApp/Call before dispatch."
          : "Order placed successfully! Please send payment screenshot via WhatsApp for instant confirmation.",
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

    // Restore inventory stock for both COD and EasyPaisa
    for (const item of order.items) {
      await Product.updateOne({ id: item.productId }, { $inc: { stock: item.quantity } });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = reason || "Cancelled by customer/admin";
    order.timeline.push({
      status: "cancelled",
      timestamp: new Date(),
      note: reason || "Cancelled and inventory stock restored",
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
    const { status, paymentStatus, paymentMethod, search } = req.query;
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (paymentStatus && paymentStatus !== "all") {
      filter.paymentStatus = paymentStatus;
    }

    if (paymentMethod && paymentMethod !== "all") {
      filter.paymentMethod = paymentMethod;
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
    const { status, courierName, trackingNumber, deliveryNote, note } = req.body;

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    // Business Rule: JazzCash orders can only be confirmed after payment is marked "paid"
    if (status === "confirmed" && (order.paymentMethod === "easypaisa" || order.paymentMethod === "jazzcash") && order.paymentStatus !== "paid") {
      res.status(400).json({
        success: false,
        message: "Order cannot be confirmed until payment status is marked as 'paid'. Please verify customer JazzCash transfer first.",
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

    // Courier and tracking are manual/optional
    if (courierName !== undefined) order.courierName = courierName;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;

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

    if (!paymentStatus || !["pending_verification", "cod_pending", "paid", "rejected"].includes(paymentStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid payment status. Must be 'pending_verification', 'cod_pending', 'paid', or 'rejected'.",
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
      message: `Payment status updated to '${paymentStatus}' successfully`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Mark COD Cash as collected upon delivery
export async function markCashCollected(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    order.paymentStatus = "paid";
    order.status = "delivered";
    order.timeline.push({
      status: "delivered",
      timestamp: new Date(),
      note: note || "Cash collected from customer upon delivery. Order completed.",
    });

    await order.save();

    res.json({
      success: true,
      data: order,
      message: "Cash marked as collected and order marked as delivered.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Mark order as Fake / Unreachable (cancels order, restores stock, optionally blocks phone)
export async function markFakeOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { blockPhone = true, reason = "Marked as fake / unreachable" } = req.body;

    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.status !== "cancelled") {
      // Restore inventory stock
      for (const item of order.items) {
        await Product.updateOne({ id: item.productId }, { $inc: { stock: item.quantity } });
      }

      order.status = "cancelled";
      order.cancelledAt = new Date();
      order.cancelReason = reason;
      order.timeline.push({
        status: "cancelled",
        timestamp: new Date(),
        note: `Cancelled: ${reason}`,
      });
      await order.save();
    }

    // Add phone to blocked list if requested
    let phoneBlocked = false;
    if (blockPhone && order.customer?.phone) {
      const cleanPhone = order.customer.phone.trim();
      const setting = await Setting.findOne();
      if (setting) {
        if (!setting.blockedPhoneNumbers.includes(cleanPhone)) {
          setting.blockedPhoneNumbers.push(cleanPhone);
          await setting.save();
          phoneBlocked = true;
        }
      }
    }

    res.json({
      success: true,
      data: order,
      phoneBlocked,
      message: `Order #${order.orderId} cancelled, stock restored${phoneBlocked ? `, and phone ${order.customer?.phone} blocked` : ""}.`,
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
