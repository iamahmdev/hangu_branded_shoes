import { Request, Response } from "express";
import { Coupon } from "../models/Coupon.js";

export async function verifyCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: "Coupon code is required." });
      return;
    }

    const cleanCode = String(code).toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      res.status(404).json({ success: false, message: "Invalid or inactive coupon code." });
      return;
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      res.status(400).json({ success: false, message: "This coupon code has expired." });
      return;
    }

    if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
      res.status(400).json({ success: false, message: "This coupon has reached its maximum usage limit." });
      return;
    }

    if (subtotal < coupon.minOrderAmount) {
      res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart total of Rs. ${coupon.minOrderAmount.toLocaleString()}.`,
      });
      return;
    }

    const discountAmount = Math.round((Number(subtotal) * coupon.discountPercent) / 100);

    res.json({
      success: true,
      valid: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
        minOrderAmount: coupon.minOrderAmount,
      },
      message: `Coupon ${coupon.code} applied! You saved Rs. ${discountAmount.toLocaleString()} (${coupon.discountPercent}% OFF).`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getCoupons(req: Request, res: Response): Promise<void> {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { code, discountPercent, minOrderAmount, isActive, expiresAt, maxUses } = req.body;

    if (!code || discountPercent === undefined) {
      res.status(400).json({ success: false, message: "Coupon code and discount percentage are required." });
      return;
    }

    const cleanCode = String(code).toUpperCase().trim();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      res.status(409).json({ success: false, message: "Coupon with this code already exists." });
      return;
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      discountPercent: Number(discountPercent),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      maxUses: maxUses ? Number(maxUses) : undefined,
    });

    res.status(201).json({ success: true, data: coupon, message: "Coupon created successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      res.status(404).json({ success: false, message: "Coupon not found" });
      return;
    }

    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

