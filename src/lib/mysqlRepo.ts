import bcrypt from "bcryptjs";
import pool, { initMySQLTables } from "./mysql";

// Helper to safely parse JSON from MySQL columns
function parseJson<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// -----------------------------------------------------------------------------
// 1. ADMIN REPOSITORY
// -----------------------------------------------------------------------------
export const AdminRepo = {
  async ensureTables() {
    await initMySQLTables();
  },

  async findByUsername(username: string) {
    await this.ensureTables();
    const clean = username.trim().toLowerCase();
    const [rows]: any = await pool.query(
      "SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1",
      [clean, clean]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: String(r.id),
      _id: String(r.id),
      username: r.username,
      email: r.email,
      passwordHash: r.password_hash,
      name: r.name,
      role: r.role,
      permissions: parseJson(r.permissions, ["*"]),
      isActive: Boolean(r.is_active),
      lastLogin: r.last_login,
      comparePassword: async (candidate: string) => {
        if (!r.password_hash) return false;
        return await bcrypt.compare(candidate, r.password_hash);
      },
    };
  },

  async updateLastLogin(id: number | string) {
    await this.ensureTables();
    await pool.query("UPDATE admins SET last_login = NOW() WHERE id = ?", [id]);
  },

  async updatePassword(id: number | string, newHash: string) {
    await this.ensureTables();
    await pool.query("UPDATE admins SET password_hash = ? WHERE id = ?", [newHash, id]);
  },

  async ensureDefaultAdmin() {
    await this.ensureTables();
    const [rows]: any = await pool.query("SELECT id FROM admins LIMIT 1");
    if (!rows || rows.length === 0) {
      const hash = await bcrypt.hash("Hangu@Admin#2026!", 10);
      await pool.query(
        "INSERT INTO admins (username, email, password_hash, name, role, permissions, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          "admin",
          "info@hangubrandedshoes.com",
          hash,
          "Hangu Store Owner",
          "admin",
          JSON.stringify(["*"]),
          true,
        ]
      );
    }
  },
};

// -----------------------------------------------------------------------------
// 2. PRODUCT REPOSITORY
// -----------------------------------------------------------------------------
export const ProductRepo = {
  async ensureTables() {
    await initMySQLTables();
  },

  async findAll(activeOnly = true) {
    await this.ensureTables();
    const sql = activeOnly
      ? "SELECT * FROM products WHERE is_active = TRUE ORDER BY id DESC"
      : "SELECT * FROM products ORDER BY id DESC";
    const [rows]: any = await pool.query(sql);
    return rows.map(this.mapProduct);
  },

  async findById(id: number | string) {
    await this.ensureTables();
    const [rows]: any = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [Number(id)]);
    if (!rows || rows.length === 0) return null;
    return this.mapProduct(rows[0]);
  },

  async create(data: any) {
    await this.ensureTables();
    // Auto-generate numeric ID if not present
    let id = Number(data.id);
    if (!id || isNaN(id)) {
      const [maxRow]: any = await pool.query("SELECT MAX(id) as maxId FROM products");
      id = (maxRow[0]?.maxId || 100) + 1;
    }

    const sizes = Array.isArray(data.sizes) ? data.sizes : ["39", "40", "41", "42", "43", "44"];
    const colors = Array.isArray(data.colors) ? data.colors : ["Black", "Brown"];
    const images = Array.isArray(data.images) ? data.images : (data.img ? [data.img] : []);
    const features = Array.isArray(data.features) ? data.features : [];

    await pool.query(
      `INSERT INTO products 
      (id, name, cat, price, old_price, img, images, stock, rating, reviews_count, description, badge, is_sale, is_featured, is_bestseller, is_active, sizes, colors, features) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      name=VALUES(name), cat=VALUES(cat), price=VALUES(price), old_price=VALUES(old_price), img=VALUES(img), images=VALUES(images), stock=VALUES(stock), description=VALUES(description), badge=VALUES(badge), is_active=VALUES(is_active), sizes=VALUES(sizes), colors=VALUES(colors)`,
      [
        id,
        data.name,
        data.cat || "Sneakers",
        Number(data.price),
        data.old ? Number(data.old) : null,
        data.img || (images[0] || "/images/p1.jpg"),
        JSON.stringify(images),
        Number(data.stock ?? 25),
        Number(data.rating || 5.0),
        Number(data.reviews || 0),
        data.desc || "",
        data.badge || "",
        Boolean(data.isSale),
        Boolean(data.isFeatured),
        Boolean(data.isBestseller),
        data.isActive !== false,
        JSON.stringify(sizes),
        JSON.stringify(colors),
        JSON.stringify(features),
      ]
    );

    return await this.findById(id);
  },

  async update(id: number | string, data: any) {
    await this.ensureTables();
    const existing = await this.findById(id);
    if (!existing) return null;

    const merged = { ...existing, ...data };
    return await this.create(merged);
  },

  async delete(id: number | string) {
    await this.ensureTables();
    const [res]: any = await pool.query("DELETE FROM products WHERE id = ?", [Number(id)]);
    return res.affectedRows > 0;
  },

  mapProduct(r: any) {
    return {
      _id: String(r.id),
      id: Number(r.id),
      name: r.name,
      cat: r.cat,
      price: Number(r.price),
      old: r.old_price ? Number(r.old_price) : undefined,
      img: r.img,
      images: parseJson<string[]>(r.images, [r.img]),
      stock: Number(r.stock),
      rating: Number(r.rating || 5.0),
      reviews: Number(r.reviews_count || 0),
      desc: r.description,
      badge: r.badge || "",
      isSale: Boolean(r.is_sale),
      isFeatured: Boolean(r.is_featured),
      isBestseller: Boolean(r.is_bestseller),
      isActive: Boolean(r.is_active),
      sizes: parseJson<string[]>(r.sizes, ["39", "40", "41", "42", "43", "44"]),
      colors: parseJson<string[]>(r.colors, ["Black", "Brown"]),
      features: parseJson<string[]>(r.features, []),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  },
};

// -----------------------------------------------------------------------------
// 3. ORDER REPOSITORY
// -----------------------------------------------------------------------------
export const OrderRepo = {
  async ensureTables() {
    await initMySQLTables();
  },

  async findAll(limit = 100) {
    await this.ensureTables();
    const [rows]: any = await pool.query("SELECT * FROM orders ORDER BY id DESC LIMIT ?", [limit]);
    return rows.map(this.mapOrder);
  },

  async findByOrderId(orderId: string) {
    await this.ensureTables();
    const [rows]: any = await pool.query(
      "SELECT * FROM orders WHERE order_id = ? OR id = ? LIMIT 1",
      [orderId, Number(orderId) || 0]
    );
    if (!rows || rows.length === 0) return null;
    return this.mapOrder(rows[0]);
  },

  async create(data: any) {
    await this.ensureTables();
    const orderId = data.orderId || `HBS${Date.now().toString().slice(-6)}`;
    const customer = data.customer || {};
    const items = Array.isArray(data.items) ? data.items : [];
    const timeline = Array.isArray(data.timeline) ? data.timeline : [{ status: "awaiting_confirmation", timestamp: new Date() }];

    await pool.query(
      `INSERT INTO orders 
      (order_id, customer_name, customer_phone, customer_city, customer_address, items, subtotal, shipping_fee, cod_fee, total_amount, payment_method, payment_status, transaction_id, payment_screenshot, notes, delivery_note, customer_ip, status, timeline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        customer.name || "",
        customer.phone || "",
        customer.city || "",
        customer.address || "",
        JSON.stringify(items),
        Number(data.subtotal || 0),
        Number(data.shippingFee || 0),
        Number(data.codFee || 0),
        Number(data.totalAmount || 0),
        data.paymentMethod || "cod",
        data.paymentStatus || "cod_pending",
        data.transactionId || null,
        data.paymentScreenshot || null,
        data.notes || null,
        data.deliveryNote || null,
        data.customerIp || null,
        data.status || "awaiting_confirmation",
        JSON.stringify(timeline),
      ]
    );

    return await this.findByOrderId(orderId);
  },

  async updateStatus(orderId: string, status: string, note?: string) {
    await this.ensureTables();
    const order = await this.findByOrderId(orderId);
    if (!order) return null;

    const timeline = [...(order.timeline || []), { status, timestamp: new Date(), note }];
    await pool.query(
      "UPDATE orders SET status = ?, timeline = ? WHERE order_id = ?",
      [status, JSON.stringify(timeline), order.orderId]
    );
    return await this.findByOrderId(orderId);
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    await this.ensureTables();
    await pool.query("UPDATE orders SET payment_status = ? WHERE order_id = ?", [paymentStatus, orderId]);
    return await this.findByOrderId(orderId);
  },

  async delete(orderId: string) {
    await this.ensureTables();
    const [res]: any = await pool.query(
      "DELETE FROM orders WHERE order_id = ? OR id = ?",
      [orderId, Number(orderId) || 0]
    );
    return res.affectedRows > 0;
  },

  mapOrder(r: any) {
    return {
      _id: String(r.id),
      id: r.id,
      orderId: r.order_id,
      customer: {
        name: r.customer_name,
        phone: r.customer_phone,
        city: r.customer_city,
        address: r.customer_address,
      },
      items: parseJson(r.items, []),
      subtotal: Number(r.subtotal),
      shippingFee: Number(r.shipping_fee || 0),
      codFee: Number(r.cod_fee || 0),
      totalAmount: Number(r.total_amount),
      paymentMethod: r.payment_method,
      paymentStatus: r.payment_status,
      transactionId: r.transaction_id,
      paymentScreenshot: r.payment_screenshot,
      notes: r.notes,
      deliveryNote: r.delivery_note,
      customerIp: r.customer_ip,
      status: r.status,
      cancelledAt: r.cancelled_at,
      cancelReason: r.cancel_reason,
      courierName: r.courier_name,
      trackingNumber: r.tracking_number,
      timeline: parseJson(r.timeline, []),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  },
};

// -----------------------------------------------------------------------------
// 4. SETTING REPOSITORY
// -----------------------------------------------------------------------------
export const SettingRepo = {
  async ensureTables() {
    await initMySQLTables();
  },

  async get() {
    await this.ensureTables();
    const [rows]: any = await pool.query("SELECT * FROM settings WHERE id = 1 LIMIT 1");
    if (!rows || rows.length === 0) {
      await pool.query("INSERT INTO settings (id) VALUES (1)");
      return await this.get();
    }
    const r = rows[0];
    return {
      shopName: r.shop_name,
      phone: r.phone,
      whatsappNumber: r.whatsapp_number,
      email: r.email,
      address: r.address,
      shopTiming: r.shop_timing,
      shippingFee: Number(r.shipping_fee),
      freeShippingThreshold: Number(r.free_shipping_threshold),
      announcementText: r.announcement_text,
      isStoreOpen: Boolean(r.is_store_open),
      jazzcashNumber: r.jazzcash_number,
      jazzcashTitle: r.jazzcash_title,
      easypaisaNumber: r.easypaisa_number,
      easypaisaTitle: r.easypaisa_title,
      enableCod: Boolean(r.enable_cod),
      codFee: Number(r.cod_fee),
      blockedPhoneNumbers: parseJson(r.blocked_phone_numbers, []),
      deletedProductIds: parseJson(r.deleted_product_ids, []),
      hasInitializedProducts: Boolean(r.has_initialized_products),
      heroBanner1: r.hero_banner_1,
      heroBanner2: r.hero_banner_2,
      heroBanner3: r.hero_banner_3,
    };
  },

  async update(data: any) {
    await this.ensureTables();
    await pool.query(
      `UPDATE settings SET 
      shop_name = COALESCE(?, shop_name),
      phone = COALESCE(?, phone),
      whatsapp_number = COALESCE(?, whatsapp_number),
      email = COALESCE(?, email),
      address = COALESCE(?, address),
      shop_timing = COALESCE(?, shop_timing),
      shipping_fee = COALESCE(?, shipping_fee),
      free_shipping_threshold = COALESCE(?, free_shipping_threshold),
      announcement_text = COALESCE(?, announcement_text),
      is_store_open = COALESCE(?, is_store_open),
      jazzcash_number = COALESCE(?, jazzcash_number),
      jazzcash_title = COALESCE(?, jazzcash_title),
      easypaisa_number = COALESCE(?, easypaisa_number),
      easypaisa_title = COALESCE(?, easypaisa_title),
      enable_cod = COALESCE(?, enable_cod),
      cod_fee = COALESCE(?, cod_fee),
      hero_banner_1 = COALESCE(?, hero_banner_1),
      hero_banner_2 = COALESCE(?, hero_banner_2),
      hero_banner_3 = COALESCE(?, hero_banner_3)
      WHERE id = 1`,
      [
        data.shopName,
        data.phone,
        data.whatsappNumber,
        data.email,
        data.address,
        data.shopTiming,
        data.shippingFee,
        data.freeShippingThreshold,
        data.announcementText,
        data.isStoreOpen,
        data.jazzcashNumber,
        data.jazzcashTitle,
        data.easypaisaNumber,
        data.easypaisaTitle,
        data.enableCod,
        data.codFee,
        data.heroBanner1,
        data.heroBanner2,
        data.heroBanner3,
      ]
    );
    return await this.get();
  },
};

// -----------------------------------------------------------------------------
// 5. UPLOADED IMAGE REPOSITORY
// -----------------------------------------------------------------------------
export const ImageRepo = {
  async ensureTables() {
    await initMySQLTables();
  },

  async save(id: string, filename: string, contentType: string, buffer: Buffer) {
    await this.ensureTables();
    await pool.query(
      "INSERT INTO uploaded_images (id, filename, content_type, data, size) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE filename=VALUES(filename), content_type=VALUES(content_type), data=VALUES(data), size=VALUES(size)",
      [id, filename, contentType, buffer, buffer.length]
    );
  },

  async findById(id: string) {
    await this.ensureTables();
    const cleanId = id.replace(/\.[a-zA-Z0-9]+$/, "");
    const [rows]: any = await pool.query(
      "SELECT id, filename, content_type, data, size FROM uploaded_images WHERE id = ? LIMIT 1",
      [cleanId]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      filename: r.filename,
      contentType: r.content_type,
      data: Buffer.from(r.data),
      size: Number(r.size),
    };
  },

  async delete(id: string) {
    await this.ensureTables();
    const cleanId = id.replace(/\.[a-zA-Z0-9]+$/, "");
    const [res]: any = await pool.query("DELETE FROM uploaded_images WHERE id = ?", [cleanId]);
    return res.affectedRows > 0;
  },
};
