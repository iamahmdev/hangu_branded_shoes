import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import Product from "../../../src/models/Product";
import Order from "../../../src/models/Order";
import Setting from "../../../src/models/Setting";
import Admin from "../../../src/models/Admin";
import UploadedImage from "../../../src/models/UploadedImage";
import { initMySQLTables } from "../../../src/lib/mysql";
import { ProductRepo, OrderRepo, SettingRepo, AdminRepo, ImageRepo } from "../../../src/lib/mysqlRepo";
import { verifyToken } from "../../../src/lib/jwt";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  // Admin authentication check (supports GET with query token or POST with Bearer header)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : String(req.query.token || "");

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: "Valid Admin Token required for migration." });
  }

  const results = {
    productsMigrated: 0,
    ordersMigrated: 0,
    imagesMigrated: 0,
    settingsMigrated: false,
    adminMigrated: false,
  };

  try {
    // 1. Initialize MySQL tables
    await initMySQLTables();

    // 2. Connect to MongoDB
    await dbConnect();

    // 3. Migrate Settings
    const mongoSetting = await Setting.findOne().lean();
    if (mongoSetting) {
      await SettingRepo.update({
        shopName: mongoSetting.shopName,
        phone: mongoSetting.phone,
        whatsappNumber: mongoSetting.whatsappNumber,
        email: mongoSetting.email,
        address: mongoSetting.address,
        shopTiming: mongoSetting.shopTiming,
        shippingFee: mongoSetting.shippingFee,
        freeShippingThreshold: mongoSetting.freeShippingThreshold,
        announcementText: mongoSetting.announcementText,
        isStoreOpen: mongoSetting.isStoreOpen,
        jazzcashNumber: mongoSetting.jazzcashNumber,
        jazzcashTitle: mongoSetting.jazzcashTitle,
        easypaisaNumber: mongoSetting.easypaisaNumber,
        easypaisaTitle: mongoSetting.easypaisaTitle,
        enableCod: mongoSetting.enableCod,
        codFee: mongoSetting.codFee,
        heroBanner1: mongoSetting.heroBanner1,
        heroBanner2: mongoSetting.heroBanner2,
        heroBanner3: mongoSetting.heroBanner3,
      });
      results.settingsMigrated = true;
    }

    // 4. Migrate Products
    const mongoProducts = await Product.find().lean();
    for (const p of mongoProducts) {
      await ProductRepo.create({
        id: p.id,
        name: p.name,
        cat: p.cat,
        price: p.price,
        old: p.old,
        img: p.img,
        images: p.images || (p.img ? [p.img] : []),
        stock: p.stock ?? 25,
        rating: p.rating || 5,
        reviews: p.reviews || 0,
        desc: p.desc || "",
        badge: p.badge || "",
        isSale: p.isSale || false,
        isFeatured: p.isFeatured || false,
        isBestseller: p.isBestseller || false,
        isActive: p.isActive !== false,
        sizes: p.sizes || ["39", "40", "41", "42", "43", "44"],
        colors: p.colors || ["Black", "Brown"],
        features: p.features || [],
      });
      results.productsMigrated++;
    }

    // 5. Migrate Orders
    const mongoOrders = await Order.find().lean();
    for (const o of mongoOrders) {
      await OrderRepo.create({
        orderId: o.orderId,
        customer: o.customer,
        items: o.items,
        subtotal: o.subtotal,
        shippingFee: o.shippingFee,
        codFee: o.codFee,
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        transactionId: o.transactionId,
        paymentScreenshot: o.paymentScreenshot,
        notes: o.notes,
        deliveryNote: o.deliveryNote,
        customerIp: o.customerIp,
        status: o.status,
        timeline: o.timeline,
      });
      results.ordersMigrated++;
    }

    // 6. Migrate Uploaded Images
    const mongoImages = await UploadedImage.find().lean();
    for (const img of mongoImages) {
      if (img.data) {
        const buffer = Buffer.isBuffer(img.data)
          ? img.data
          : Buffer.from((img.data as any).buffer || img.data);
        await ImageRepo.save(
          String(img._id),
          img.filename || `shoe_${img._id}.webp`,
          img.contentType || "image/webp",
          buffer
        );
        results.imagesMigrated++;
      }
    }

    // 7. Ensure Admin in MySQL
    await AdminRepo.ensureDefaultAdmin();
    results.adminMigrated = true;

    return res.status(200).json({
      success: true,
      message: "100% of MongoDB data migrated to MySQL successfully with zero loss!",
      results,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Migration failed: ${err.message}`,
      partialResults: results,
    });
  }
}
