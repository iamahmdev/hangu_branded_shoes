import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedProduct, UnifiedSetting } from "../../../src/lib/unifiedDb";
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

      const body = req.body || {};
      const created = await UnifiedProduct.create(body);
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
    const setting = await UnifiedSetting.get();
    const deletedIds = (setting?.deletedProductIds || []).map(String);

    let allProducts = await UnifiedProduct.findAll(true);

    if (deletedIds.length > 0) {
      allProducts = allProducts.filter((p: any) => !deletedIds.includes(String(p.id)));
    }

    if (cat && cat !== "All") {
      const catStr = String(cat).toLowerCase();
      allProducts = allProducts.filter((p: any) => (p.cat || "").toLowerCase() === catStr);
    }

    if (search) {
      const q = String(search).trim().toLowerCase();
      allProducts = allProducts.filter((p: any) => {
        const name = (p.name || "").toLowerCase();
        const pCat = (p.cat || "").toLowerCase();
        const desc = (p.desc || "").toLowerCase();
        return name.includes(q) || pCat.includes(q) || desc.includes(q);
      });
    }

    if (sort === "price-low") {
      allProducts.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price-high") {
      allProducts.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
    } else if (sort === "newest") {
      allProducts.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
    }

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res.status(200).json({
      success: true,
      count: allProducts.length,
      data: allProducts,
    });
  } catch (dbErr) {
    console.warn("MySQL fetch failed in /api/products, falling back:", dbErr);
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
