import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  isActive: boolean;
  expiresAt?: Date;
  usageCount: number;
  maxUses?: number;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    minOrderAmount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    usageCount: { type: Number, default: 0 },
    maxUses: { type: Number },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);

