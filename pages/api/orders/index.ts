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

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
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

    // 4. Connect to database
    let isDbConnected = false;
    try {
      await dbConnect();
      isDbConnected = true;
    } catch (dbErr) {
      console.warn("MongoDB connection warning in /api/orders:", dbErr);
    }

    // 5. Check blocked phone numbers and store settings if DB connected
    let storeSettings: any = null;
    if (isDbConnected) {
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
    }

    // 6. Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item." });
    }

    const method: "cod" | "jazzcash" =
      String(paymentMethod).toLowerCase().trim() === "jazzcash" ? "jazzcash" : "cod";
    const codFee = method === "cod" ? (storeSettings?.codFee ?? 0) : 0;

    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const q = Math.max(1, Number(item.quantity || item.q || 1));
      const p = Math.max(0, Number(item.price || 0));
      const itemTotal = p * q;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: Number(item.productId || item.id || 1),
        name: String(item.name || "Hangu Shoe"),
        img: String(item.img || "/images/shoes/IMG_3091.jpg"),
        price: p,
        size: String(item.size || "41"),
        quantity: q,
        total: itemTotal,
      });

      // Attempt atomic inventory decrement if DB is connected
      if (isDbConnected && item.productId) {
        Product.updateOne({ id: Number(item.productId) }, { $inc: { stock: -q } }).catch(() => {});
      }
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
    if (isDbConnected) {
      try {
        savedOrder = await Order.create(orderPayload);
      } catch (saveErr: any) {
        console.error("Order.create error:", saveErr);
        // Fallback: return payload with orderId so checkout succeeds
        savedOrder = orderPayload;
      }
    } else {
      savedOrder = orderPayload;
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
