import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import dbConnect from "../../../src/lib/dbConnect";
import Order from "../../../src/models/Order";
import Product from "../../../src/models/Product";
import Setting from "../../../src/models/Setting";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      await dbConnect();
      const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
      return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to fetch orders" });
    }
  }

  // Handle Order Cancellation and Inventory Restoration
  if (req.method === "PATCH" || (req.method === "POST" && req.body?.action === "cancel")) {
    try {
      await dbConnect();
      const orderIdentifier =
        req.query.orderId ||
        req.query.id ||
        req.body?.orderId ||
        req.body?.id;
      const { reason } = req.body || {};

      if (!orderIdentifier || typeof orderIdentifier !== "string") {
        return res.status(400).json({ success: false, message: "Order ID is required." });
      }

      const cleanId = orderIdentifier.trim();
      const order = await Order.findOne({
        $or: [
          { orderId: cleanId },
          { orderId: cleanId.toUpperCase() },
          { _id: cleanId.match(/^[0-9a-fA-F]{24}$/) ? cleanId : null },
        ],
      });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found." });
      }

      if (order.status === "dispatched" || order.status === "delivered") {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel order after dispatch or delivery.",
        });
      }

      if (order.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Order is already cancelled.",
        });
      }

      // Restore inventory stock for all items
      for (const item of order.items) {
        if (item.productId) {
          await Product.updateOne({ id: Number(item.productId) }, { $inc: { stock: Number(item.quantity) } });
        }
      }

      order.status = "cancelled";
      order.cancelledAt = new Date();
      order.cancelReason = reason || "Cancelled by customer/admin";
      order.timeline = order.timeline || [];
      order.timeline.push({
        status: "cancelled",
        timestamp: new Date(),
        note: reason || "Cancelled and inventory stock restored",
      });

      await order.save();

      return res.status(200).json({
        success: true,
        data: order,
        message: "Order cancelled successfully and stock restored.",
      });
    } catch (cancelErr: any) {
      console.error("Order cancel error:", cancelErr);
      return res.status(500).json({
        success: false,
        message: cancelErr.message || "Failed to cancel order",
      });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST", "PATCH"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

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
    } = req.body || {};

    // 1. Honeypot check for bots
    if (hp || website) {
      return res.status(400).json({ success: false, message: "Bot activity detected." });
    }

    // 2. Validate customer information presence
    if (!customer || !customer.name || !customer.phone || !customer.city || !customer.address) {
      return res.status(400).json({ success: false, message: "Complete customer information is required." });
    }

    const cleanAddress = String(customer.address).trim();
    if (cleanAddress.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please provide a complete delivery address (at least 8 characters with street/area details).",
      });
    }

    // 3. Pakistani phone number validation
    const rawPhone = String(customer.phone).trim();
    const digitsOnly = rawPhone.replace(/\D/g, "");
    const isValidPakistaniMobile = /^(03\d{9}|923\d{9})$/.test(digitsOnly);

    if (!isValidPakistaniMobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid Pakistani mobile number (e.g. 0333-1234567).",
      });
    }

    const normalizedPhone = digitsOnly.startsWith("92") ? "0" + digitsOnly.slice(2) : digitsOnly;

    // 4. Connect to database - strict connection (no fake offline fallback for live orders)
    try {
      await dbConnect();
    } catch (dbErr: any) {
      console.error("MongoDB Atlas connection failed in /api/orders:", dbErr.message);
      return res.status(503).json({
        success: false,
        message: "Database connection failed. Please try again or place your order via WhatsApp.",
      });
    }

    // 5. Check blocked phone numbers and store settings
    let storeSettings: any = null;
    try {
      storeSettings = await Setting.findOne().lean();
      if (storeSettings?.blockedPhoneNumbers && Array.isArray(storeSettings.blockedPhoneNumbers)) {
        const isBlocked = storeSettings.blockedPhoneNumbers.some((bp: string) => {
          const cleanBp = bp.replace(/\D/g, "");
          return cleanBp && (digitsOnly.includes(cleanBp) || cleanBp.includes(digitsOnly.slice(-9)));
        });

        if (isBlocked) {
          return res.status(403).json({
            success: false,
            message: "This phone number is restricted. Please contact customer support directly on WhatsApp.",
          });
        }
      }
    } catch (settingsErr) {
      console.warn("Could not load settings:", settingsErr);
    }

    // 6. Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item." });
    }

    const method: "cod" | "jazzcash" =
      String(paymentMethod).toLowerCase().trim() === "jazzcash" ? "jazzcash" : "cod";
    const codFee = method === "cod" ? (storeSettings?.codFee ?? 0) : 0;

    let calculatedSubtotal = 0;
    const validatedItems: Array<{
      productId: number;
      name: string;
      img: string;
      price: number;
      size: string;
      quantity: number;
      total: number;
    }> = [];

    // Pre-flight check: Verify stock availability for every item to prevent overselling
    for (const item of items) {
      const q = Math.max(1, Number(item.quantity || item.q || 1));
      const p = Math.max(0, Number(item.price || 0));
      const productId = Number(item.productId || item.id || 1);
      const itemTotal = p * q;
      calculatedSubtotal += itemTotal;

      const product = await Product.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name || productId}" was not found in catalog.`,
        });
      }

      if (product.stock < q) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name || (product as any).title || item.name}". Only ${Math.max(0, product.stock)} pair(s) remaining.`,
        });
      }

      validatedItems.push({
        productId,
        name: String(product.name || (product as any).title || item.name || "Hangu Shoe"),
        img: String(product.images?.[0] || product.img || item.img || "/images/shoes/IMG_3091.jpg"),
        price: p || product.price,
        size: String(item.size || "41"),
        quantity: q,
        total: itemTotal,
      });
    }

    // 7. Atomic inventory decrement with automatic rollback
    const deductedItems: { id: number; quantity: number }[] = [];
    for (const vItem of validatedItems) {
      const updateResult = await Product.updateOne(
        { id: vItem.productId, stock: { $gte: vItem.quantity } },
        { $inc: { stock: -vItem.quantity } }
      );

      if (updateResult.modifiedCount === 0) {
        // Rollback already deducted items in this request
        for (const rolledBack of deductedItems) {
          await Product.updateOne({ id: rolledBack.id }, { $inc: { stock: rolledBack.quantity } });
        }
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${vItem.name}". Stock was reserved by another order.`,
        });
      }

      deductedItems.push({ id: vItem.productId, quantity: vItem.quantity });
    }

    const standardFee = storeSettings?.shippingFee ?? 250;
    const freeThreshold = storeSettings?.freeShippingThreshold ?? 5000;
    const shippingFee = calculatedSubtotal >= freeThreshold ? 0 : standardFee;
    const totalAmount = calculatedSubtotal + shippingFee + codFee;

    const generatedOrderId =
      req.body.orderId ||
      `HBS-${new Date().getFullYear()}-${crypto.randomInt(1000, 9999)}`;

    const orderStatus: "pending" | "awaiting_confirmation" =
      method === "jazzcash" ? "pending" : "awaiting_confirmation";
    const paymentStatus: "pending_verification" | "cod_pending" =
      method === "jazzcash" ? "pending_verification" : "cod_pending";

    const orderPayload = {
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
      paymentStatus,
      transactionId: transactionId ? String(transactionId).trim() : `COD-${Date.now().toString().slice(-6)}`,
      paymentScreenshot: paymentScreenshot ? String(paymentScreenshot).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      status: orderStatus,
      timeline: [
        {
          status: orderStatus,
          timestamp: new Date(),
          note: "Order placed via website checkout",
        },
      ],
    };

    let savedOrder = null;
    try {
      savedOrder = await Order.create(orderPayload);
    } catch (saveErr: any) {
      // Rollback deducted stock if order creation failed
      for (const rolledBack of deductedItems) {
        await Product.updateOne({ id: rolledBack.id }, { $inc: { stock: rolledBack.quantity } });
      }
      console.error("Order.create error:", saveErr);
      return res.status(500).json({
        success: false,
        message: "Failed to record order in database. Stock has been preserved.",
      });
    }

    return res.status(200).json({
      success: true,
      orderId: generatedOrderId,
      data: savedOrder,
      message: "Order recorded successfully!",
    });
  } catch (error: any) {
    console.error("Order placement handler error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process order",
    });
  }
}
