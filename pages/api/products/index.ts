import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import Product from "../../../src/models/Product";
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
    const query: any = { isActive: { $ne: false } };

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

    if (dbProducts && dbProducts.length > 0) {
      res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
      return res.status(200).json({
        success: true,
        count: dbProducts.length,
        data: dbProducts,
      });
    }
  } catch (dbErr) {
    console.warn("MongoDB fetch failed in /api/products, falling back:", dbErr);
  }

  // Fallback to static list if database is unreachable or empty
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

  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).json({
    success: true,
    count: list.length,
    data: list,
  });
}
