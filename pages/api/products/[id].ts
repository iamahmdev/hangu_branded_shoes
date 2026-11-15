import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import Product from "../../../src/models/Product";
import { FALLBACK_PRODUCTS } from "../../../src/data/fallbackProducts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;
  const numId = Number(id);

  try {
    await dbConnect();
    const dbProduct = await Product.findOne({
      $or: [{ id: numId }, { _id: typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).lean();

    if (dbProduct) {
      res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return res.status(200).json({
        success: true,
        data: dbProduct,
      });
    }
  } catch (dbErr) {
    console.warn("MongoDB fetch failed in /api/products/[id], falling back:", dbErr);
  }

  const fallback = FALLBACK_PRODUCTS.find((p) => p.id === numId);
  if (!fallback) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).json({
    success: true,
    data: fallback,
  });
}
