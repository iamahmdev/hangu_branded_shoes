import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./seed.js";

const DEFAULT_PORT = Number(process.env.PORT) || 5001;

async function startServer(): Promise<void> {
  await connectDB();
  await seedDatabase();

  const listenOnPort = (port: number) => {
    const server = app.listen(port, () => {
      console.log(`🚀 Hangu Branded Shoes API Server running on http://localhost:${port}`);
      console.log(`📡 Health Check: http://localhost:${port}/api/health`);
      console.log(`🛍️ Products Endpoint: http://localhost:${port}/api/products`);
      console.log(`⚙️ Mode: ${process.env.NODE_ENV || "development"}`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE" || err.code === "EACCES") {
        if (port === 5000) {
          console.warn(`\n⚠️ Notice: Port 5000 is occupied or reserved on Windows (HerdHelper service).`);
          console.log(`🔄 Automatically switching to alternate port 5001...`);
          listenOnPort(5001);
        } else {
          console.error(`❌ Server error:`, err);
        }
      } else {
        console.error(`❌ Server error:`, err);
      }
    });
  };

  listenOnPort(DEFAULT_PORT);
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

