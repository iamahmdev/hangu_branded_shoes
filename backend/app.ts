import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// Security Headers & Rate Limiting
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(generalLimiter);

// CORS
const configuredFrontend = process.env.FRONTEND_URL?.trim().replace(/\/+$/, "");
const allowedOrigins = [
  configuredFrontend,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/+$/, "");

      // Match configured domain or local origins
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // Automatically allow all Vercel deployments (production domain & preview URLs)
      if (/^https:\/\/[a-zA-Z0-9._-]+\.vercel\.app$/.test(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow any origin only in local development / testing
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      return callback(new Error("CORS policy violation: Access denied from this origin."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mount API Routes
app.use("/api", healthRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/upload", uploadRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;

