import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUploadedImage extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
}

const UploadedImageSchema = new Schema<IUploadedImage>(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true, default: "image/webp" },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export const UploadedImage: Model<IUploadedImage> =
  mongoose.models.UploadedImage || mongoose.model<IUploadedImage>("UploadedImage", UploadedImageSchema);

export default UploadedImage;
