import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { UnifiedOrder, UnifiedProduct, UnifiedSetting } from "../../../src/lib/unifiedDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { status, paymentStatus, paymentMethod, search } = req.query;
      let orders = await UnifiedOrder.findAll(200);

      if (status && status !== "all") {
        orders = orders.filter((o: any) => o.status === status);
      }
      if (paymentStatus && paymentStatus !== "all") {
        orders = orders.filter((o: any) => o.paymentStatus === paymentStatus);
      }
      if (paymentMethod && paymentMethod !== "all") {
        orders = orders.filter((o: any) => o.paymentMethod === paymentMethod);
      }
      if (search && typeof search === "string" && search.trim()) {
        const s = search.trim().toLowerCase();
        orders = orders.filter((o: any) => {
          const ordId = (o.orderId || "").toLowerCase();
          const custName = (o.customer?.name || "").toLowerCase();
          const custPhone = (o.customer?.phone || "").toLowerCase();
          const custCity = (o.customer?.city || "").toLowerCase();
          const txId = (o.transactionId || "").toLowerCase();
          return ordId.includes(s) || custName.includes(s) || custPhone.includes(s) || custCity.includes(s) || txId.includes(s);
        });
      }

      return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to fetch orders" });
    }
  }

  // Handle Order Cancellation and Inventory Restoration
  if (req.method === "PATCH" || (req.method === "POST" && req.body?.action === "cancel")) {
    try {
      const orderIdentifier =
        req.query.orderId ||
        req.query.id ||
        req.body?.orderId ||
        req.body?.id;
      const { reason } = req.body || {};

      if (!orderIdentifier) {
        return res.status(400).json({ success: false, message: "Order ID is required to cancel" });
      }

      const order = await UnifiedOrder.findByOrderId(String(orderIdentifier));

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
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

      // Restore inventory stock in MySQL
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.productId) {
            const prod = await UnifiedProduct.findById(item.productId);
            if (prod) {
              await UnifiedProduct.update(item.productId, {
                stock: (prod.stock || 0) + Number(item.quantity || 1),
              });
            }
          }
        }
      }

      const note = reason ? `Order cancelled: ${reason}` : "Order cancelled by customer/admin";
      await UnifiedOrder.updateStatus(order.orderId, "cancelled", note);

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully and inventory restored.",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to cancel order" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const { customer, items, paymentMethod, notes, transactionId, paymentScreenshot } = body;

      // Validation
      if (!customer || !customer.name || !customer.phone || !customer.city || !customer.address) {
        return res.status(400).json({
          success: false,
          message: "Incomplete customer details. Name, phone, city, and address are required.",
        });
      }

      const cleanPhone = String(customer.phone).trim().replace(/[\s-]/g, "");

      // Check blocked phone numbers
      const settings = await UnifiedSetting.get();
      if (settings?.blockedPhoneNumbers && Array.isArray(settings.blockedPhoneNumbers)) {
        const isBlocked = settings.blockedPhoneNumbers.some((blocked: string) =>
          cleanPhone.endsWith(blocked.slice(-9))
        );
        if (isBlocked) {
          return res.status(403).json({
            success: false,
            message: "Unable to place order. Please contact our WhatsApp support for assistance.",
          });
        }
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "Order must contain at least one item." });
      }

      // Validate products & check inventory stock
      let subtotal = 0;
      const orderItems: any[] = [];

      for (const cartItem of items) {
        const prod = await UnifiedProduct.findById(cartItem.id || cartItem.productId);
        const price = prod ? prod.price : Number(cartItem.price) || 0;
        const name = prod ? prod.name : cartItem.name || "Footwear";
        const img = prod ? prod.img : cartItem.img || "/images/p1.jpg";
        const quantity = Number(cartItem.quantity) || 1;

        if (prod && prod.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Sorry, "${prod.name}" has only ${prod.stock} pairs left in stock.`,
          });
        }

        subtotal += price * quantity;
        orderItems.push({
          productId: prod ? prod.id : cartItem.id,
          name,
          img,
          price,
          quantity,
          size: cartItem.size || "42",
          color: cartItem.color || "Default",
        });
      }

      // Shipping & Fees calculation
      const shippingFee =
        subtotal >= (settings?.freeShippingThreshold || 5000)
          ? 0
          : (settings?.shippingFee ?? 250);

      const codFee = paymentMethod === "cod" ? (settings?.codFee ?? 0) : 0;
      const totalAmount = subtotal + shippingFee + codFee;

      // Unique Order ID format
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
      const orderId = `HBS-${datePart}-${randomHex}`;

      const clientIp =
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.socket.remoteAddress ||
        "";

      const initialStatus =
        paymentMethod === "cod" ? "awaiting_confirmation" : "pending";
      const initialPaymentStatus =
        paymentMethod === "cod" ? "cod_pending" : "pending_verification";

      // Decrement stock for confirmed checkout
      for (const cartItem of orderItems) {
        if (cartItem.productId) {
          const prod = await UnifiedProduct.findById(cartItem.productId);
          if (prod) {
            const newStock = Math.max(0, (prod.stock || 0) - cartItem.quantity);
            await UnifiedProduct.update(cartItem.productId, { stock: newStock });
          }
        }
      }

      // Create Order in MySQL
      const newOrder = await UnifiedOrder.create({
        orderId,
        customer: {
          name: customer.name.trim(),
          phone: cleanPhone,
          city: customer.city.trim(),
          address: customer.address.trim(),
        },
        items: orderItems,
        subtotal,
        shippingFee,
        codFee,
        totalAmount,
        paymentMethod: paymentMethod || "cod",
        paymentStatus: initialPaymentStatus,
        transactionId: transactionId || null,
        paymentScreenshot: paymentScreenshot || null,
        notes: notes || null,
        customerIp: String(clientIp),
        status: initialStatus,
        timeline: [
          {
            status: initialStatus,
            timestamp: new Date(),
            note:
              paymentMethod === "cod"
                ? "Order received. Pending WhatsApp confirmation."
                : "Order received. Verification required for online payment.",
          },
        ],
      });

      return res.status(201).json({
        success: true,
        orderId,
        data: newOrder,
        message: "Order placed successfully!",
      });
    } catch (err: any) {
      console.error("Order creation error:", err);
      return res.status(500).json({ success: false, message: err.message || "Failed to place order" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PATCH"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
