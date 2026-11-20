import dbConnect from "./dbConnect";
import Product from "../models/Product";
import Order from "../models/Order";
import Setting from "../models/Setting";
import Admin from "../models/Admin";
import UploadedImage from "../models/UploadedImage";
import { ProductRepo, OrderRepo, SettingRepo, AdminRepo, ImageRepo } from "./mysqlRepo";

export function isMySQL(): boolean {
  return process.env.DB_TYPE === "mysql";
}

// -----------------------------------------------------------------------------
// UNIFIED PRODUCTS
// -----------------------------------------------------------------------------
export const UnifiedProduct = {
  async findAll(activeOnly = true) {
    if (isMySQL()) {
      return await ProductRepo.findAll(activeOnly);
    }
    await dbConnect();
    const query = activeOnly ? { isActive: { $ne: false } } : {};
    return await Product.find(query).sort({ id: -1 }).lean();
  },

  async findById(id: number | string) {
    if (isMySQL()) {
      return await ProductRepo.findById(id);
    }
    await dbConnect();
    const numId = Number(id);
    const conditions: any[] = [];
    if (!isNaN(numId)) conditions.push({ id: numId });
    if (typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)) conditions.push({ _id: id });
    if (conditions.length === 0) return null;
    return await Product.findOne({ $or: conditions }).lean();
  },

  async create(data: any) {
    if (isMySQL()) {
      return await ProductRepo.create(data);
    }
    await dbConnect();
    if (!data.id) {
      const last = await Product.findOne().sort({ id: -1 }).lean();
      data.id = last && (last as any).id ? (last as any).id + 1 : Date.now();
    }
    return await Product.create(data);
  },

  async update(id: number | string, data: any) {
    if (isMySQL()) {
      return await ProductRepo.update(id, data);
    }
    await dbConnect();
    const numId = Number(id);
    const conditions: any[] = [];
    if (!isNaN(numId)) conditions.push({ id: numId });
    if (typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)) conditions.push({ _id: id });
    return await Product.findOneAndUpdate({ $or: conditions }, { $set: data }, { new: true });
  },

  async delete(id: number | string) {
    if (isMySQL()) {
      return await ProductRepo.delete(id);
    }
    await dbConnect();
    const numId = Number(id);
    const conditions: any[] = [];
    if (!isNaN(numId)) conditions.push({ id: numId });
    if (typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)) conditions.push({ _id: id });
    const res = await Product.deleteMany({ $or: conditions });
    return res.deletedCount > 0;
  },

  async count() {
    if (isMySQL()) {
      const list = await ProductRepo.findAll(false);
      return list.length;
    }
    await dbConnect();
    return await Product.countDocuments();
  },
};

// -----------------------------------------------------------------------------
// UNIFIED ORDERS
// -----------------------------------------------------------------------------
export const UnifiedOrder = {
  async findAll(limit = 100) {
    if (isMySQL()) {
      return await OrderRepo.findAll(limit);
    }
    await dbConnect();
    return await Order.find().sort({ createdAt: -1 }).limit(limit).lean();
  },

  async findByOrderId(orderId: string) {
    if (isMySQL()) {
      return await OrderRepo.findByOrderId(orderId);
    }
    await dbConnect();
    const clean = orderId.trim();
    return await Order.findOne({
      $or: [
        { orderId: clean },
        { orderId: clean.toUpperCase() },
        { _id: clean.match(/^[0-9a-fA-F]{24}$/) ? clean : null },
      ],
    }).lean();
  },

  async create(data: any) {
    if (isMySQL()) {
      return await OrderRepo.create(data);
    }
    await dbConnect();
    return await Order.create(data);
  },

  async updateStatus(orderId: string, status: string, note?: string) {
    if (isMySQL()) {
      return await OrderRepo.updateStatus(orderId, status, note);
    }
    await dbConnect();
    const order = await this.findByOrderId(orderId);
    if (!order) return null;
    const timeline = [...((order as any).timeline || []), { status, timestamp: new Date(), note }];
    return await Order.findOneAndUpdate(
      { orderId: (order as any).orderId },
      { $set: { status, timeline } },
      { new: true }
    );
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    if (isMySQL()) {
      return await OrderRepo.updatePaymentStatus(orderId, paymentStatus);
    }
    await dbConnect();
    return await Order.findOneAndUpdate({ orderId }, { $set: { paymentStatus } }, { new: true });
  },

  async delete(orderId: string) {
    if (isMySQL()) {
      return await OrderRepo.delete(orderId);
    }
    await dbConnect();
    const clean = orderId.trim();
    const res = await Order.deleteMany({
      $or: [
        { orderId: clean },
        { orderId: clean.toUpperCase() },
        { _id: clean.match(/^[0-9a-fA-F]{24}$/) ? clean : null },
      ],
    });
    return res.deletedCount > 0;
  },

  async count() {
    if (isMySQL()) {
      const list = await OrderRepo.findAll(500);
      return list.length;
    }
    await dbConnect();
    return await Order.countDocuments();
  },
};

// -----------------------------------------------------------------------------
// UNIFIED SETTINGS
// -----------------------------------------------------------------------------
export const UnifiedSetting = {
  async get() {
    if (isMySQL()) {
      return await SettingRepo.get();
    }
    await dbConnect();
    const s = await Setting.findOne().lean();
    if (!s) {
      const created = await Setting.create({});
      return created.toObject();
    }
    return s;
  },

  async update(data: any) {
    if (isMySQL()) {
      return await SettingRepo.update(data);
    }
    await dbConnect();
    return await Setting.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true }).lean();
  },
};

// -----------------------------------------------------------------------------
// UNIFIED IMAGES
// -----------------------------------------------------------------------------
export const UnifiedImage = {
  async save(id: string, filename: string, contentType: string, buffer: Buffer) {
    if (isMySQL()) {
      return await ImageRepo.save(id, filename, contentType, buffer);
    }
    await dbConnect();
    await UploadedImage.create({
      _id: id,
      filename,
      contentType,
      data: buffer,
      size: buffer.length,
    });
  },

  async findById(id: string) {
    if (isMySQL()) {
      return await ImageRepo.findById(id);
    }
    await dbConnect();
    const clean = id.replace(/\.[a-zA-Z0-9]+$/, "");
    return await UploadedImage.findById(clean).lean();
  },

  async delete(id: string) {
    if (isMySQL()) {
      return await ImageRepo.delete(id);
    }
    await dbConnect();
    const clean = id.replace(/\.[a-zA-Z0-9]+$/, "");
    const res = await UploadedImage.findByIdAndDelete(clean);
    return Boolean(res);
  },
};

// -----------------------------------------------------------------------------
// UNIFIED ADMIN
// -----------------------------------------------------------------------------
export const UnifiedAdmin = {
  async findByUsername(username: string) {
    if (isMySQL()) {
      return await AdminRepo.findByUsername(username);
    }
    await dbConnect();
    const clean = username.trim().toLowerCase();
    return await Admin.findOne({
      $or: [{ username: clean }, { email: clean }],
    });
  },

  async updatePassword(id: string, newHash: string) {
    if (isMySQL()) {
      return await AdminRepo.updatePassword(id, newHash);
    }
    await dbConnect();
    await Admin.findByIdAndUpdate(id, { $set: { passwordHash: newHash, password: newHash } });
  },

  async updateLastLogin(id: string) {
    if (isMySQL()) {
      return await AdminRepo.updateLastLogin(id);
    }
    await dbConnect();
    await Admin.findByIdAndUpdate(id, { $set: { lastLogin: new Date() } });
  },
};
