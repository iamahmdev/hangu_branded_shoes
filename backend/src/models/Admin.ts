import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  password?: string;
  name: string;
  role: "superadmin" | "manager" | "support";
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String },
    password: { type: String },
    name: { type: String, default: "Admin", trim: true },
    role: { type: String, enum: ["superadmin", "manager", "support"], default: "superadmin" },
    permissions: { type: [String], default: ["*"] },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  const hash = this.passwordHash || (this as any).password;
  if (!hash) return false;
  return bcrypt.compare(candidate, hash);
};

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

