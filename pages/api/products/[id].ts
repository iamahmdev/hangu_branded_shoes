import type { NextApiRequest, NextApiResponse } from "next";
import { UnifiedProduct, UnifiedSetting } from "../../../src/lib/unifiedDb";
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

      const targetId = !isNaN(numId) ? numId : String(id);
      const updated = await UnifiedProduct.update(targetId, req.body);

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

      const targetId = !isNaN(numId) ? numId : String(id);
      await UnifiedProduct.delete(targetId);

      // Add to deletedProductIds so fallback list also excludes it permanently
      const setting = await UnifiedSetting.get();
      const currentDeleted = setting?.deletedProductIds || [];
      if (!currentDeleted.includes(String(id))) {
        await UnifiedSetting.update({
          deletedProductIds: [...currentDeleted, String(id)],
        });
      }

      return res.status(200).json({ success: true, message: `Product #${id} deleted successfully` });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || "Failed to delete product" });
    }
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const targetId = !isNaN(numId) ? numId : String(id);
    const product = await UnifiedProduct.findById(targetId);

    if (product) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res.status(200).json({ success: true, data: product });
    }
  } catch (dbErr) {
    console.warn("MySQL fetch failed in /api/products/[id], falling back:", dbErr);
  }

  // Fallback to static data if not found in MySQL
  if (!isNaN(numId)) {
    const fallback = FALLBACK_PRODUCTS.find((p) => p.id === numId);
    if (fallback) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res.status(200).json({ success: true, data: fallback });
    }
  }

  return res.status(404).json({ success: false, message: "Product not found" });
}
