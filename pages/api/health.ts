import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    status: "ok",
    service: "Hangu Branded Shoes API",
    mode: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
}
