import mongoose from "mongoose";
import dns from "dns";

// Ensure SRV records can be resolved on Windows networks where local DNS lacks SRV support
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if platform restriction
}

export async function connectDB(uri?: string): Promise<void> {
  const mongoUri = uri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hangu_branded_shoes";

  // Check if placeholder is still present
  if (mongoUri.includes("<db_password>")) {
    console.warn("\n⚠️ Warning: '<db_password>' placeholder detected in MONGODB_URI.");
    console.warn("👉 Please replace '<db_password>' in 'backend/.env' with your actual MongoDB Atlas database user password.");
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    if (process.env.NODE_ENV !== "test") {
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    }
  } catch (error: any) {
    console.error("❌ MongoDB Connection Error:", error.message || error);
    if (process.env.NODE_ENV !== "test" && !mongoUri.includes("<db_password>")) {
      process.exit(1);
    }
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
