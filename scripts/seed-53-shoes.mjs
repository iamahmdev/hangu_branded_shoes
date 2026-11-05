import mongoose from "../backend/node_modules/mongoose/index.js";
import fs from "fs";
import path from "path";

const SHOE_NAMES = [
  "Hangu Heritage Oxford",
  "Airflex Ultra Runner",
  "Classic Royal Derby",
  "KP Handcrafted Penny Loafer",
  "CloudWalk Ortho Slip-On",
  "Executive Cap-Toe Formal",
  "Apex Performance Sneaker",
  "Venetian Soft Leather Moccasin",
  "Khyber Rugged Leather Boot",
  "Monkstrap Antique Burnished",
  "Veloce Carbon Street Runner",
  "Signature Brogue Gentleman",
  "ErgoStep Memory Foam Walker",
  "Chelsea Suede Ankle Boot",
  "Urban Pulse Lifestyle Trainer",
  "Classic Wholecut Formal",
  "Driving Loafer Gripped Sole",
  "Breeze Knit Athletic Sneaker",
  "Imperial Wingtip Derby",
  "Zenith Lightweight Runner",
  "Sovereign Double Monkstrap",
  "Comfort Fit Diabetic Daily",
  "Chukka Hand-Stitched Boot",
  "Retro Court Vintage Sneaker",
  "Monarch Patent Tuxedo Oxford",
  "Riviera Tassel Leather Loafer",
  "AeroGlide Daily Jogger",
  "Highlander Combat Ankle Boot",
  "Prestige Cap-Toe Brown Derby",
  "Air Cushion Pro Athletic",
  "Tuscan Pebble Leather Loafer",
  "Metropolitan Formal Oxford",
  "FlexMotion Walking Shoe",
  "Sahara Suede Desert Boot",
  "Phantom All-Black Street Sneaker",
  "Khyber Artisan Slip-On",
  "Marathon Featherlight Trainer",
  "Milano Horsebit Gold Loafer",
  "Elite Goodyear Welted Derby",
  "Nordic Winter Leather Boot",
  "Strata Mesh Breathable Runner",
  "Diplomat Polished Black Oxford",
  "Velvet Touch Padded Loafer",
  "Active Dynamic Cushioned Sneaker",
  "Frontier Rugged Casual Boot",
  "Regal Hand-Finished Brogue",
  "Quantum Energy Sport Runner",
  "Heritage Horsebit Moccasin",
  "Savile Row Formal Derby",
  "Peak Performance Outdoor Sneaker",
  "Grandmaster Leather Loafer",
  "Vanguard Tactical Boot",
  "Hangu Masterpiece Edition Shoe",
];

const CATEGORIES = ["Sneakers", "Formal", "Loafers", "Comfort", "Boots"];

const BADGES = [
  "New Arrival",
  "Bestseller",
  "100% Pure Leather",
  "Featured",
  "Top Rated",
  "Exclusive",
  "Comfort Edition",
  "Handcrafted",
];

const PRICES = [
  3499, 3999, 4499, 4999, 5299, 5499, 5999, 6499, 6999, 7499, 7999, 8499, 8999,
];

async function seedDatabase(targetUri) {
  console.log(`\nConnecting to: ${targetUri}...`);
  const conn = await mongoose.connect(targetUri, {
    serverSelectionTimeoutMS: 5000,
  });

  const imgFiles = fs
    .readdirSync("public/images/shoes")
    .filter((f) => f.endsWith(".jpg"))
    .sort();

  console.log(`Found ${imgFiles.length} real shoe photos.`);

  const products = imgFiles.map((filename, index) => {
    const id = index + 1;
    const name = SHOE_NAMES[index] || `Hangu Premium Footwear #${id}`;
    const cat = CATEGORIES[index % CATEGORIES.length];
    const price = PRICES[index % PRICES.length];
    const old = Math.round(price * (1.25 + (index % 3) * 0.05));
    const badge = BADGES[index % BADGES.length];
    const stock = 10 + ((index * 3) % 25);
    const reviews = 15 + ((index * 7) % 85);

    return {
      id,
      name,
      cat,
      price,
      old,
      img: `/images/shoes/${filename}`,
      images: [`/images/shoes/${filename}`],
      stock,
      rating: 5,
      reviews,
      desc: `Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.`,
      badge,
      isSale: index % 2 === 0,
      isFeatured: index < 12 || index % 4 === 0,
      isBestseller: index % 3 === 0,
      isActive: true,
      sizes: ["39", "40", "41", "42", "43", "44"],
      colors:
        index % 3 === 0
          ? ["Jet Black", "Deep Brown"]
          : index % 3 === 1
          ? ["Walnut Tan", "Charcoal"]
          : ["Midnight Blue", "Pure White"],
      features: [
        "100% Authentic Hand-Finished Craftsmanship",
        "Shock-Absorbing Memory Sole",
        "Breathable Anti-Odor Lining",
        "Cash on Delivery Nationwide across Pakistan",
      ],
    };
  });

  const collection = conn.connection.collection("products");
  await collection.deleteMany({});
  await collection.insertMany(products);

  const count = await collection.countDocuments();
  console.log(`✅ Successfully seeded ${count} real shoe products into: ${targetUri}!`);

  await mongoose.disconnect();
}

async function run() {
  // 1. Seed Local DBngin MongoDB
  try {
    await seedDatabase("mongodb://127.0.0.1:27017/hangu_branded_shoes");
  } catch (err) {
    console.error("Local MongoDB seeding error:", err.message);
  }

  // 2. Seed Atlas if configured
  try {
    const envContent = fs.readFileSync("backend/.env", "utf8");
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1] && !match[1].includes("127.0.0.1")) {
      const atlasUri = match[1].trim();
      console.log("Attempting Atlas seeding...");
      await seedDatabase(atlasUri);
    }
  } catch (err) {
    console.warn("Atlas seeding skipped or unreachable:", err.message);
  }
}

run().catch(console.error);
