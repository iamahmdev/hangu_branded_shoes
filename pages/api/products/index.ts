import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import Product from "../../../src/models/Product";
import Setting from "../../../src/models/Setting";
import { FALLBACK_PRODUCTS } from "../../../src/data/fallbackProducts";
import { verifyToken } from "../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
      }

      await dbConnect();
      const body = req.body || {};

      // Determine next numeric ID if not provided
      if (!body.id) {
        const lastProduct = await Product.findOne().sort({ id: -1 }).lean();
        body.id = lastProduct && (lastProduct as any).id ? (lastProduct as any).id + 1 : Date.now();
      }

      const created = await Product.create(body);
      return res.status(201).json({ success: true, data: created, message: "Product created successfully" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to create product" });
    }
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { cat, search, sort } = req.query;

  try {
    await dbConnect();

    // Check for deletedProductIds & initialize seed if DB was never initialized
    const setting = await Setting.findOne().select("deletedProductIds hasInitializedProducts").lean();
    const deletedIds = (setting?.deletedProductIds || []).map(String);

    if (!setting?.hasInitializedProducts) {
      const existingCount = await Product.countDocuments();
      if (existingCount === 0) {
        const seedData = FALLBACK_PRODUCTS.filter((p) => !deletedIds.includes(String(p.id)));
        if (seedData.length > 0) {
          try {
            await Product.insertMany(seedData, { ordered: false });
          } catch {}
        }
        await Setting.findOneAndUpdate({}, { $set: { hasInitializedProducts: true } }, { upsert: true });
      }
    }

    const query: any = { isActive: { $ne: false } };

    if (deletedIds.length > 0) {
      const numericDeletedIds = deletedIds.map(Number).filter((n) => !isNaN(n));
      query.id = { $nin: numericDeletedIds };
    }

    if (cat && cat !== "All") {
      query.cat = { $regex: new RegExp(`^${String(cat)}$`, "i") };
    }

    if (search) {
      const q = String(search).trim();
      query.$or = [
        { name: { $regex: new RegExp(q, "i") } },
        { cat: { $regex: new RegExp(q, "i") } },
        { desc: { $regex: new RegExp(q, "i") } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    else if (sort === "price-high") sortOption = { price: -1 };
    else if (sort === "newest") sortOption = { id: -1 };

    const dbProducts = await Product.find(query).sort(sortOption).lean();

    // Always prevent stale browser / CDN caching so deletions reflect instantly
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res.status(200).json({
      success: true,
      count: dbProducts.length,
      data: dbProducts,
    });
  } catch (dbErr) {
    console.warn("MongoDB fetch failed in /api/products, falling back:", dbErr);
  }

  // Fallback to static list ONLY if database is completely unreachable
  let list = [...FALLBACK_PRODUCTS];

  if (cat && cat !== "All") {
    list = list.filter((p) => p.cat.toLowerCase() === String(cat).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        (p.tag && p.tag.toLowerCase().includes(q))
    );
  }

  if (sort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    list.sort((a, b) => b.id - a.id);
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return res.status(200).json({
    success: true,
    count: list.length,
    data: list,
  });
}
