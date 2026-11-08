import mongoose, { Document, Schema } from "mongoose";

export interface ISetting extends Document {
  shopName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  shopTiming: string;
  shippingFee: number;
  freeShippingThreshold: number;
  announcementText: string;
  isStoreOpen: boolean;
  easypaisaNumber: string;
  easypaisaTitle: string;
  enableCod: boolean;
  codFee: number;
  blockedPhoneNumbers: string[];
}

const SettingSchema = new Schema<ISetting>(
  {
    shopName: { type: String, default: "Hangu Branded Shoes", trim: true },
    phone: { type: String, default: "+92 333 3147691", trim: true },
    whatsappNumber: { type: String, default: "923333147691", trim: true },
    email: { type: String, default: "info@hangubrandedshoes.com", trim: true },
    address: { type: String, default: "Hangu Brand Shoesmen, Tahir Market, Tall Road, Hangu.", trim: true },
    shopTiming: { type: String, default: "8:00 AM to 5:00 PM", trim: true },
    shippingFee: { type: Number, default: 250, min: 0 },
    freeShippingThreshold: { type: Number, default: 5000, min: 0 },
    announcementText: {
      type: String,
      default: "Free Delivery Across Pakistan on Orders Over Rs. 5,000 | JazzCash Verification",
    },
    isStoreOpen: { type: Boolean, default: true },
    // Empty by default for production - configured via Admin Settings tab
    easypaisaNumber: { type: String, default: "03275430305", trim: true },
    easypaisaTitle: { type: String, default: "Muhammad Atif Ibrahim", trim: true },
    enableCod: { type: Boolean, default: true },
    codFee: { type: Number, default: 0, min: 0 },
    blockedPhoneNumbers: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>("Setting", SettingSchema);
