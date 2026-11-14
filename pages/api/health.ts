import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import https from "https";
import dbConnect from "../../src/lib/dbConnect";

function getOutboundIp(): Promise<string> {
  return new Promise((resolve) => {
    https
      .get("https://api.ipify.org?format=json", { timeout: 3000 }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data).ip);
          } catch {
            resolve("unknown");
          }
        });
      })
      .on("error", () => resolve("failed"));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const outboundIp = await getOutboundIp();
  let dbStatus = "disconnected";
  let dbError = null;

  try {
    const conn = await dbConnect();
    dbStatus = conn.connection.readyState === 1 ? "connected" : "connecting";
  } catch (err: any) {
    dbStatus = "error";
    dbError = {
      message: err.message,
      code: err.code,
      name: err.name,
    };
  }

  const rawEnvUri = process.env.MONGODB_URI || "";
  const maskedUri = rawEnvUri
    ? rawEnvUri.replace(/:([^:@]+)@/, ":****@")
    : "not_set (using fallback)";

  return res.status(200).json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    service: "Hangu Branded Shoes API",
    mode: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
    outboundIp,
    envUriConfigured: Boolean(process.env.MONGODB_URI),
    envUriMasked: maskedUri,
    database: {
      status: dbStatus,
      error: dbError,
    },
  });
}
