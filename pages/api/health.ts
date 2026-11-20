import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../src/lib/mysql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let dbStatus = "disconnected";
  let dbError = null;

  try {
    const [rows]: any = await pool.query("SELECT 1 as val");
    if (rows && rows[0]?.val === 1) {
      dbStatus = "connected";
    }
  } catch (err: any) {
    dbStatus = "error";
    dbError = {
      message: err.message,
      code: err.code,
    };
  }

  return res.status(200).json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    database: "MySQL (Hostinger)",
    service: "Hangu Branded Shoes API",
    mode: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
    dbStatus,
    dbError,
  });
}
