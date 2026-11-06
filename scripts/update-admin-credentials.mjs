import mongoose from "../backend/node_modules/mongoose/index.js";
import bcrypt from "../backend/node_modules/bcryptjs/index.js";
import fs from "fs";

const USERNAME = "hangu_admin";
const EMAIL = "admin@hangubrandedshoes.com";
const RAW_PASSWORD = "Hangu@Admin#2026!";

async function updateAdmin(uri) {
  console.log(`Connecting to: ${uri}...`);
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  const collection = conn.connection.collection("admins");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(RAW_PASSWORD, salt);

  const filter = {
    $or: [{ username: USERNAME }, { username: "admin" }, { email: EMAIL }],
  };

  const update = {
    $set: {
      username: USERNAME,
      email: EMAIL,
      passwordHash: passwordHash,
      name: "Hangu Store Owner",
      role: "admin",
      permissions: ["*"],
      isActive: true,
      updatedAt: new Date(),
    },
  };

  const res = await collection.updateOne(filter, update, { upsert: true });
  console.log(`✅ Admin updated on ${uri}: matched=${res.matchedCount}, modified=${res.modifiedCount}, upserted=${res.upsertedCount}`);

  await mongoose.disconnect();
}

async function run() {
  try {
    await updateAdmin("mongodb://127.0.0.1:27017/hangu_branded_shoes");
  } catch (err) {
    console.error("Local update error:", err.message);
  }

  try {
    const envContent = fs.readFileSync("backend/.env", "utf8");
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1] && !match[1].includes("127.0.0.1")) {
      const atlasUri = match[1].trim();
      await updateAdmin(atlasUri);
    }
  } catch (err) {
    console.warn("Atlas skipped or unreachable:", err.message);
  }

  console.log("\n🎉 New Admin Credentials Configured Successfully!");
  console.log(`👉 Username: ${USERNAME}`);
  console.log(`👉 Email:    ${EMAIL}`);
  console.log(`👉 Password: ${RAW_PASSWORD}`);
}

run().catch(console.error);
