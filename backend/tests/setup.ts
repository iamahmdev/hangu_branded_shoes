/// <reference types="jest" />
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const TEST_DB_URI = process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017/hangu_branded_shoes_test";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test_super_secret_jwt_key";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Drop test database to leave clean state
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

