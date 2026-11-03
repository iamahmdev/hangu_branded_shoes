import mongoose, { Document, Schema } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  source: string;
  status: "new" | "in_progress" | "resolved" | "archived";
  adminNotes?: string;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved", "archived"],
      default: "new",
      index: true,
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiry>("Inquiry", InquirySchema);

