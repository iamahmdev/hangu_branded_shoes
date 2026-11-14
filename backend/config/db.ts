import mongoose from "mongoose";
import dns from "dns";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore
}

const DIRECT_ATLAS_FALLBACK =
  "mongodb://ahmaddev42_db_user:NPnoQqC1Z62XANVX@ac-o9cxlbv-shard-00-00.rxe1sim.mongodb.net:27017,ac-o9cxlbv-shard-00-01.rxe1sim.mongodb.net:27017,ac-o9cxlbv-shard-00-02.rxe1sim.mongodb.net:27017/hangu_branded_shoes?ssl=true&replicaSet=atlas-m72d13-shard-0&authSource=admin&retryWrites=true&w=majority";

export async function connectDB(uri?: string): Promise<void> {
  const mongoUri =
    uri ||
    process.env.MONGODB_URI ||
    "mongodb+srv://ahmaddev42_db_user:NPnoQqC1Z62XANVX@cluster0.rxe1sim.mongodb.net/hangu_branded_shoes?retryWrites=true&w=majority";

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
      console.warn(`⚠️ Primary MongoDB connection failed (${primaryErr.message}). Attempting direct replica-set fallback...`);

      try {
        const atlasConn = await mongoose.connect(DIRECT_ATLAS_FALLBACK, {
          serverSelectionTimeoutMS: 6000,
        });
        if (process.env.NODE_ENV !== "test") {
          console.log(`✅ MongoDB Connected via Direct ReplicaSet: ${atlasConn.connection.host}`);
        }
        return;
      } catch (atlasErr: any) {
        console.error("❌ Direct Atlas replica fallback failed:", atlasErr.message);
      }

      const localUri = "mongodb://127.0.0.1:27017/hangu_branded_shoes";
      if (mongoUri !== localUri) {
        try {
          const localConn = await mongoose.connect(localUri, {
            serverSelectionTimeoutMS: 2000,
          });
          console.log(`✅ Connected to Local MongoDB: ${localConn.connection.host}`);
          return;
        } catch (localErr: any) {
          // ignore
        }
      }
      throw primaryErr;
    }
  } catch (error: any) {
    if (process.env.NODE_ENV !== "test") {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
