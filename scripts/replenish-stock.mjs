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

const URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ahmaddev42_db_user:NPnoQqC1Z62XANVX@cluster0.rxe1sim.mongodb.net/hangu_branded_shoes?retryWrites=true&w=majority";

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(URI);
  console.log("Connected to Atlas!");

  const db = mongoose.connection.db;

  // Replenish product 1 and any other products with low/negative stock
  const result = await db.collection("products").updateMany(
    {
      $or: [
        { stock: { $lte: 2 } },
        { id: 1 },
      ],
    },
    {
      $set: {
        stock: 50,
        stockCount: 50,
        inStock: true,
      },
    }
  );

  console.log(`Replenished ${result.modifiedCount} products to 50 pairs.`);

  const p1 = await db.collection("products").findOne({ id: 1 });
  console.log(`Product 1 ("${p1?.name}") new stock:`, p1?.stock, "pairs.");

  await mongoose.disconnect();
  console.log("Done!");
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
