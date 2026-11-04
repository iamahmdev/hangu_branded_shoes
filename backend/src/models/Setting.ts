import mongoose, { Document, Schema } from "mongoose";

export interface ISetting extends Document {
  announcementText: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  shippingFee: number;
  freeShippingThreshold: number;
  isStoreOpen: boolean;
  jazzcashNumber: string;
  jazzcashTitle: string;
  easypaisaNumber: string;
  easypaisaTitle: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIban: string;
}

const SettingSchema = new Schema<ISetting>(
  {
    announcementText: { type: String, default: "Special 10% OFF with code: HANGU10 | Free Delivery Across Pakistan on Rs. 5000+" },
    phone: { type: String, default: "+92 345 9680373" },
    whatsappNumber: { type: String, default: "923459680373" },
    email: { type: String, default: "info@hangubrandedshoes.com" },
    address: { type: String, default: "Main Bazar, Hangu, KP, Pakistan" },
    shippingFee: { type: Number, default: 250 },
    freeShippingThreshold: { type: Number, default: 5000 },
    isStoreOpen: { type: Boolean, default: true },
    jazzcashNumber: { type: String, default: "03333147691" },
    jazzcashTitle: { type: String, default: "Hangu Branded Shoes" },
    easypaisaNumber: { type: String, default: "03333147691" },
    easypaisaTitle: { type: String, default: "Hangu Branded Shoes" },
    bankName: { type: String, default: "Meezan Bank" },
    bankAccountTitle: { type: String, default: "Hangu Branded Shoes" },
    bankAccountNumber: { type: String, default: "01020304050607" },
    bankIban: { type: String, default: "PK00MEZN0000000102030405" },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>("Setting", SettingSchema);

