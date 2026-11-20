import { ProductRepo, OrderRepo, SettingRepo, AdminRepo, ImageRepo } from "./mysqlRepo";

// -----------------------------------------------------------------------------
// UNIFIED PRODUCTS (100% MySQL Powered)
// -----------------------------------------------------------------------------
export const UnifiedProduct = {
  async findAll(activeOnly = true) {
    return await ProductRepo.findAll(activeOnly);
  },

  async findById(id: number | string) {
    return await ProductRepo.findById(id);
  },

  async create(data: any) {
    return await ProductRepo.create(data);
  },

  async update(id: number | string, data: any) {
    return await ProductRepo.update(id, data);
  },

  async delete(id: number | string) {
    return await ProductRepo.delete(id);
  },

  async count() {
    const list = await ProductRepo.findAll(false);
    return list.length;
  },
};

// -----------------------------------------------------------------------------
// UNIFIED ORDERS (100% MySQL Powered)
// -----------------------------------------------------------------------------
export const UnifiedOrder = {
  async findAll(limit = 100) {
    return await OrderRepo.findAll(limit);
  },

  async findByOrderId(orderId: string) {
    return await OrderRepo.findByOrderId(orderId);
  },

  async create(data: any) {
    return await OrderRepo.create(data);
  },

  async updateStatus(orderId: string, status: string, note?: string) {
    return await OrderRepo.updateStatus(orderId, status, note);
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    return await OrderRepo.updatePaymentStatus(orderId, paymentStatus);
  },

  async delete(orderId: string) {
    return await OrderRepo.delete(orderId);
  },

  async count() {
    const list = await OrderRepo.findAll(500);
    return list.length;
  },
};

// -----------------------------------------------------------------------------
// UNIFIED SETTINGS (100% MySQL Powered)
// -----------------------------------------------------------------------------
export const UnifiedSetting = {
  async get() {
    return await SettingRepo.get();
  },

  async update(data: any) {
    return await SettingRepo.update(data);
  },
};

// -----------------------------------------------------------------------------
// UNIFIED IMAGES (100% MySQL Powered)
// -----------------------------------------------------------------------------
export const UnifiedImage = {
  async save(id: string, filename: string, contentType: string, buffer: Buffer) {
    return await ImageRepo.save(id, filename, contentType, buffer);
  },

  async findById(id: string) {
    return await ImageRepo.findById(id);
  },

  async delete(id: string) {
    return await ImageRepo.delete(id);
  },
};

// -----------------------------------------------------------------------------
// UNIFIED ADMIN (100% MySQL Powered)
// -----------------------------------------------------------------------------
export const UnifiedAdmin = {
  async findByUsername(username: string) {
    return await AdminRepo.findByUsername(username);
  },

  async updatePassword(id: string | number, newHash: string) {
    return await AdminRepo.updatePassword(id, newHash);
  },

  async updateLastLogin(id: string | number) {
    return await AdminRepo.updateLastLogin(id);
  },
};
