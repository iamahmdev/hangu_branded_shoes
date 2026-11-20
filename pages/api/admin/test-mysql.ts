import type { NextApiRequest, NextApiResponse } from "next";
import pool, { initMySQLTables } from "../../../src/lib/mysql";
import { AdminRepo } from "../../../src/lib/mysqlRepo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Initialize all tables
    await initMySQLTables();

    // 2. Ensure default admin
    await AdminRepo.ensureDefaultAdmin();

    // 3. Inspect tables in the database
    const [tables]: any = await pool.query("SHOW TABLES");

    // 4. Check admin count
    const [admins]: any = await pool.query("SELECT id, username, email, role FROM admins");

    return res.status(200).json({
      success: true,
      message: "MySQL connected and all tables initialized successfully!",
      database: process.env.MYSQL_DATABASE || "u288979278_hangushoes",
      tables: tables.map((t: any) => Object.values(t)[0]),
      adminUser: admins[0] || null,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `MySQL test failed: ${err.message}`,
      code: err.code,
    });
  }
}
