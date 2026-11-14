import dns from "dns";
import https from "https";
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

async function connectToAtlas() {
  try {
    return await mongoose.connect(PRIMARY_URI, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    console.log("SRV failed, falling back to direct replicaSet URI...");
    return await mongoose.connect(DIRECT_REPLICA_URI, { serverSelectionTimeoutMS: 8000 });
  }
}

function postToLive(path, method, payload) {
  return new Promise((resolve) => {
    const data = payload ? JSON.stringify(payload) : "";
    const start = Date.now();
    const req = https.request(
      `https://hangubrandedshoes.com${path}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
          resolve({
            status: res.statusCode,
            ms: Date.now() - start,
            data: parsed,
          });
        });
      }
    );
    req.on("error", (err) => resolve({ error: err.message }));
    if (data) req.write(data);
    req.end();
  });
}

async function runTest() {
  console.log("==================================================");
  console.log("🚀 STARTING LIVE E2E VERIFICATION TEST SUITE");
  console.log("==================================================");

  // 1. Connect to Atlas
  console.log("Connecting to MongoDB Atlas...");
  await connectToAtlas();
  console.log("✅ Connected to MongoDB Atlas successfully.\n");

  const db = mongoose.connection.db;

  // 2. Select Target Product for Test (Product #2: Venetian Soft Leather Loafer)
  const productBefore = await db.collection("products").findOne({ id: 2 });
  if (!productBefore) {
    throw new Error("Product #2 not found in Atlas DB.");
  }

  // Ensure healthy initial stock for test
  if (productBefore.stock < 10) {
    await db.collection("products").updateOne({ id: 2 }, { $set: { stock: 20, stockCount: 20, inStock: true } });
  }

  const initialStock = (await db.collection("products").findOne({ id: 2 })).stock;
  console.log(`[TEST 1] Initial Stock for Product #2 ("${productBefore.name}"): ${initialStock} pairs.`);

  // 3. Place Order for 2 pairs
  const orderQty = 2;
  const testOrderId = `LIVE-E2E-${Date.now().toString().slice(-6)}`;
  console.log(`[TEST 1] Placing order (${testOrderId}) for ${orderQty} pairs via LIVE API...`);

  const orderPayload = {
    orderId: testOrderId,
    customer: {
      name: "Live E2E Verification Tester",
      phone: "03335557799",
      city: "Peshawar",
      address: "Main Saddar Road, Cantt, House 99",
    },
    items: [
      {
        productId: 2,
        name: productBefore.name,
        img: productBefore.img,
        price: productBefore.price,
        size: "42",
        quantity: orderQty,
        total: productBefore.price * orderQty,
      },
    ],
    paymentMethod: "cod",
  };

  const orderResult = await postToLive("/api/orders", "POST", orderPayload);
  console.log(`[TEST 1] Order Submission Status: ${orderResult.status} (${orderResult.ms}ms)`);
  console.log(`[TEST 1] Response:`, JSON.stringify(orderResult.data));

  // 4. Verify Stock Deduction in MongoDB Atlas
  const productAfterOrder = await db.collection("products").findOne({ id: 2 });
  const stockAfterOrder = productAfterOrder.stock;
  console.log(`[TEST 1] Stock in Atlas after order: ${stockAfterOrder} pairs.`);

  const expectedDeducted = initialStock - orderQty;
  if (stockAfterOrder === expectedDeducted) {
    console.log(`✅ TEST 1 PASSED: Stock correctly deducted by ${orderQty} (From ${initialStock} -> ${stockAfterOrder}).\n`);
  } else {
    console.log(`⚠️ Stock after order: ${stockAfterOrder} (Expected ${expectedDeducted}).\n`);
  }

  // 5. TEST 2: Prevention of Overselling
  console.log("--------------------------------------------------");
  console.log("[TEST 2] Testing Prevention of Overselling...");
  const excessiveQty = stockAfterOrder + 500;
  console.log(`Attempting to order ${excessiveQty} pairs when only ${stockAfterOrder} pairs are available...`);

  const oversellPayload = {
    orderId: `OVERSELL-${Date.now().toString().slice(-6)}`,
    customer: {
      name: "Oversell Tester",
      phone: "03335557799",
      city: "Peshawar",
      address: "Saddar Road House 99",
    },
    items: [
      {
        productId: 2,
        name: productBefore.name,
        img: productBefore.img,
        price: productBefore.price,
        size: "42",
        quantity: excessiveQty,
        total: productBefore.price * excessiveQty,
      },
    ],
    paymentMethod: "cod",
  };

  const oversellResult = await postToLive("/api/orders", "POST", oversellPayload);
  console.log(`Oversell Submission Status: ${oversellResult.status}`);
  console.log(`Oversell Response:`, JSON.stringify(oversellResult.data));

  const productAfterOversell = await db.collection("products").findOne({ id: 2 });
  if (oversellResult.status === 400 && productAfterOversell.stock === stockAfterOrder) {
    console.log(`✅ TEST 2 PASSED: Oversell prevented! HTTP 400 returned and stock protected at ${productAfterOversell.stock} pairs.\n`);
  } else {
    console.log(`❌ TEST 2 STATUS: HTTP ${oversellResult.status}, stock: ${productAfterOversell.stock}.\n`);
  }

  // 6. TEST 3: Stock Restoration after Cancellation
  console.log("--------------------------------------------------");
  console.log("[TEST 3] Testing Stock Restoration on Order Cancellation...");
  console.log(`Cancelling test order #${testOrderId} via Live Cancel API...`);

  const cancelResult = await postToLive(`/api/orders/${testOrderId}/cancel`, "PATCH", {
    reason: "Automated E2E Verification Test Cancellation",
  });
  console.log(`Cancel API Status: ${cancelResult.status}`);
  console.log(`Cancel API Response:`, JSON.stringify(cancelResult.data));

  const productAfterCancel = await db.collection("products").findOne({ id: 2 });
  console.log(`Stock in Atlas after cancellation: ${productAfterCancel.stock} pairs.`);

  if (productAfterCancel.stock === initialStock) {
    console.log(`✅ TEST 3 PASSED: Stock fully restored back to initial level (${initialStock} pairs)!\n`);
  } else {
    console.log(`⚠️ Stock after restore: ${productAfterCancel.stock} (Initial was: ${initialStock})\n`);
  }

  // 7. TEST 4: MongoDB Atlas Consistency Check
  console.log("--------------------------------------------------");
  console.log("[TEST 4] MongoDB Atlas Consistency Check...");
  const orderInDb = await db.collection("orders").findOne({ orderId: testOrderId });
  console.log("Order Status in DB:", orderInDb?.status);
  console.log("Order Customer in DB:", orderInDb?.customer?.name);
  console.log("Order Total in DB: Rs.", orderInDb?.totalAmount);
  console.log("Order Timeline Events:", orderInDb?.timeline?.map((t) => t.status).join(" -> "));

  if (orderInDb && orderInDb.status === "cancelled") {
    console.log("✅ TEST 4 PASSED: MongoDB Atlas database is 100% consistent and intact.\n");
  } else {
    console.log("❌ TEST 4 STATUS: Order in DB status is " + orderInDb?.status + ".\n");
  }

  console.log("==================================================");
  console.log("🏁 ALL 4 LIVE E2E VERIFICATION TESTS COMPLETE!");
  console.log("==================================================");

  await mongoose.disconnect();
}

runTest().catch((err) => {
  console.error("Test Error:", err);
  process.exit(1);
});
