import type { NextApiRequest, NextApiResponse } from "next";
import { FALLBACK_PRODUCTS } from "../../../src/data/fallbackProducts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id } = req.query;
    const numId = Number(id);
    const product = FALLBACK_PRODUCTS.find((p) => p.id === numId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
