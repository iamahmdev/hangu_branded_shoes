import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  id: number;
  name: string;
  cat: string;
  price: number;
  old?: number;
  img: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  desc: string;
  badge?: string;
  isSale?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  sizes: string[];
  colors: string[];
  features: string[];
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    cat: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    old: { type: Number, min: 0 },
    img: { type: String, required: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    desc: { type: String, required: true },
    badge: { type: String },
    isSale: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    sizes: { type: [String], default: ["39", "40", "41", "42", "43", "44"] },
    colors: { type: [String], default: ["Black", "Brown"] },
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);

