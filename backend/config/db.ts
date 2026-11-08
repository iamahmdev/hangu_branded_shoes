import mongoose from "mongoose";
import dns from "dns";
import crypto from "crypto";

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
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      if (process.env.NODE_ENV !== "test") {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      }
      return;
    } catch (primaryErr: any) {
      console.warn(`⚠️ Primary MongoDB connection failed (${primaryErr.message}).`);
      
      const localUri = "mongodb://127.0.0.1:27017/hangu_branded_shoes";
      if (mongoUri !== localUri) {
        console.log(`🔄 Attempting fallback to local DBngin MongoDB at ${localUri}...`);
        try {
          const localConn = await mongoose.connect(localUri, {
            serverSelectionTimeoutMS: 3000,
          });
          console.log(`✅ Connected to Local MongoDB: ${localConn.connection.host}`);
          return;
        } catch (localErr: any) {
          console.error("❌ Local fallback also failed:", localErr.message);
        }
      }
      throw primaryErr;
    }
  } catch (error: any) {
    console.error("❌ MongoDB Connection Error:", error.message || error);
    if (error.message?.includes("IP") || error.message?.includes("whitelist")) {
      console.warn("👉 Make sure your IP address is whitelisted (or 0.0.0.0/0 allowed) in MongoDB Atlas Network Access!");
    }
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
