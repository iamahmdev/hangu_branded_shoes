import dns from "dns";
import mongoose from "mongoose";

try {
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore
}

const PRIMARY_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ahmaddev42_db_user:NPnoQqC1Z62XANVX@cluster0.rxe1sim.mongodb.net/hangu_branded_shoes?retryWrites=true&w=majority";

const DIRECT_REPLICA_URI =
  "mongodb://ahmaddev42_db_user:NPnoQqC1Z62XANVX@ac-o9cxlbv-shard-00-00.rxe1sim.mongodb.net:27017,ac-o9cxlbv-shard-00-01.rxe1sim.mongodb.net:27017,ac-o9cxlbv-shard-00-02.rxe1sim.mongodb.net:27017/hangu_branded_shoes?ssl=true&replicaSet=atlas-m72d13-shard-0&authSource=admin&retryWrites=true&w=majority";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function dbConnect(): Promise<typeof mongoose> {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    // Ignore
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 7000,
      connectTimeoutMS: 7000,
      socketTimeoutMS: 15000,
    };

    cached.promise = (async () => {
      // 1. Try primary URI (SRV)
      try {
        const instance = await mongoose.connect(PRIMARY_URI, opts);
        return instance;
      } catch (srvErr: any) {
        console.warn(
          "Primary MongoDB SRV connection failed, attempting direct replica-set fallback:",
          srvErr.message
        );
        // 2. Direct replica-set fallback for environments where SRV resolution fails
        try {
          const instance = await mongoose.connect(DIRECT_REPLICA_URI, opts);
          return instance;
        } catch (directErr: any) {
          console.error("All MongoDB connection attempts failed:", directErr.message);
          throw directErr;
        }
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
