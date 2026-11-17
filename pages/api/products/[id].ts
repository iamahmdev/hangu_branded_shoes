import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../src/lib/dbConnect";
import Product from "../../../src/models/Product";
import { FALLBACK_PRODUCTS } from "../../../src/data/fallbackProducts";
import { verifyToken } from "../../../src/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const numId = Number(id);

  if (req.method === "PUT" || req.method === "PATCH") {
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
      const matchConditions: any[] = [];
      if (!isNaN(numId)) matchConditions.push({ id: numId });
      if (typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)) matchConditions.push({ _id: id });
      if (matchConditions.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid product ID format." });
      }

      const updated = await Product.findOneAndUpdate(
        { $or: matchConditions },
        { $set: req.body },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found to update" });
      }

      return res.status(200).json({ success: true, data: updated, message: "Product updated successfully" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to update product" });
    }
  }

  if (req.method === "DELETE") {
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
      const matchConditions: any[] = [];
      if (!isNaN(numId)) matchConditions.push({ id: numId });
      if (typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)) matchConditions.push({ _id: id });
      if (matchConditions.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid product ID format." });
      }

      const deleted = await Product.findOneAndDelete({ $or: matchConditions });

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Product not found to delete" });
      }

      return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to delete product" });
    }
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET", "PUT", "DELETE", "PATCH"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

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
