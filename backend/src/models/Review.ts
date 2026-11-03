import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  shoeName: string;
  userName: string;
  city: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  verified: boolean;
  productId?: number;
}

const ReviewSchema = new Schema<IReview>(
  {
    shoeName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    verified: { type: Boolean, default: true },
    productId: { type: Number },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", ReviewSchema);

