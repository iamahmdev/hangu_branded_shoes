import type { NextApiRequest, NextApiResponse } from "next";
import { FALLBACK_PRODUCTS } from "../../../src/data/fallbackProducts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const cats = ["Sneakers", "Formal", "Loafers", "Comfort", "Boots"];
    const summary = cats.map((name) => {
      const items = FALLBACK_PRODUCTS.filter((p) => p.cat.toLowerCase() === name.toLowerCase());
      return {
        name,
        count: items.length,
        img: items[0]?.img || "/images/shoes/IMG_3091.jpg",
      };
    });

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
