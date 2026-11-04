import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: number;
  name: string;
  img: string;
  price: number;
  size: string;
  quantity: number;
  total: number;
}

export interface IOrderTimeline {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "easypaisa";
  paymentStatus: "pending_verification" | "paid" | "rejected";
  transactionId: string;
  paymentScreenshot?: string;
  notes?: string;
  status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  courierName?: string;
  trackingNumber?: string;
  timeline: IOrderTimeline[];
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    items: [
      {
        productId: { type: Number, required: true },
        name: { type: String, required: true },
        img: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["easypaisa"],
      default: "easypaisa",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending_verification", "paid", "rejected"],
      default: "pending_verification",
      index: true,
    },
    transactionId: { type: String, required: true, trim: true, index: true },
    paymentScreenshot: { type: String, trim: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "dispatched", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    courierName: { type: String },
    trackingNumber: { type: String },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
