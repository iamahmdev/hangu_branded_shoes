import mongoose from "mongoose";

export async function connectDB(uri?: string): Promise<void> {
  const mongoUri = uri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hangu_branded_shoes";
  try {
    const conn = await mongoose.connect(mongoUri);
    if (process.env.NODE_ENV !== "test") {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}

