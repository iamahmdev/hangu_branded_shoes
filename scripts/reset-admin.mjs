import mongoose from "../backend/node_modules/mongoose/index.js";
import bcrypt from "../backend/node_modules/bcryptjs/index.js";
import fs from "fs";

const newPassArg = process.argv[2];
const TARGET_PASSWORD = newPassArg || "Hangu@Admin#2026!";
const TARGET_USERNAME = "hangu_admin";
const TARGET_EMAIL = "admin@hangubrandedshoes.com";

async function run() {
  console.log("🔐 Hangu Branded Shoes — Admin Recovery Utility");
  console.log(`Setting password to: ${TARGET_PASSWORD}`);

  const localUri = "mongodb://127.0.0.1:27017/hangu_branded_shoes";
  console.log(`Connecting to local DB at ${localUri}...`);

  const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(TARGET_PASSWORD, salt);

  const collection = conn.connection.collection("admins");

  // Ensure both 'hangu_admin' and 'admin' are updated with this password
  await collection.updateMany(
    {
      $or: [
        { username: "hangu_admin" },
        { username: "admin" },
        { email: TARGET_EMAIL },
      ],
    },
    {
      $set: {
        username: TARGET_USERNAME,
        email: TARGET_EMAIL,
        passwordHash,
        name: "Hangu Store Owner",
        role: "admin",
        permissions: ["*"],
        isActive: true,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log("\n✅ Admin Account Successfully Secured & Updated!");
  console.log("--------------------------------------------------");
  console.log(`👤 Username: ${TARGET_USERNAME} (also accepts: 'admin')`);
  console.log(`📧 Email:    ${TARGET_EMAIL}`);
  console.log(`🔑 Password: ${TARGET_PASSWORD}`);
  console.log("--------------------------------------------------");

  await mongoose.disconnect();
}

run().catch(console.error);

