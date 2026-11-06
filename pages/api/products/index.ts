import type { NextApiRequest, NextApiResponse } from "next";
import { FALLBACK_PRODUCTS } from "../../../src/data/fallbackProducts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { cat, search, sort, size, inStock } = req.query;
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

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
