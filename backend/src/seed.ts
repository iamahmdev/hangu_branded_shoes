import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Product } from "./models/Product.js";
import { Review } from "./models/Review.js";
import { Coupon } from "./models/Coupon.js";
import { Setting } from "./models/Setting.js";

export const SEED_PRODUCTS = [
  {
    id: 1,
    name: "Skylite Slip-On Sneaker",
    cat: "Sneakers",
    price: 6499,
    old: 7999,
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 14,
    rating: 5,
    reviews: 124,
    desc: "Featherlight breathable mesh upper slip-on with shock-absorbing memory foam. Designed for daily active comfort in Pakistan's weather.",
    badge: "Bestseller",
    isSale: true,
    isFeatured: true,
    isBestseller: true,
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Jet Black", "Steel Grey"],
    features: ["Breathable Flyknit Mesh", "Ultra-lightweight EVA outsole", "Cushioned memory insole"],
  },
  {
    id: 2,
    name: "Classic Derby Formal Leather",
    cat: "Formal",
    price: 9499,
    old: 11999,
    img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 8,
    rating: 5,
    reviews: 89,
    desc: "100% Genuine full-grain cowhide leather derby shoe hand-burnished by master craftsmen in KP. Perfect for weddings, corporate meetings, and formal gatherings.",
    badge: "100% Pure Leather",
    isSale: false,
    isFeatured: true,
    isBestseller: true,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Deep Cognac Brown", "Midnight Black"],
    features: ["Full Grain Cowhide", "Hand-stitched welt", "Anti-skid rubberized heel"],
  },
  {
    id: 3,
    name: "Urban Air-Glide Runner",
    cat: "Sneakers",
    price: 7299,
    old: 8999,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 19,
    rating: 5,
    reviews: 215,
    desc: "Signature high-rebound cushioning sneaker featuring striking ruby red and carbon accents. Outstanding grip for jogging and lifestyle streetwear.",
    badge: "Hot Deal",
    isSale: true,
    isFeatured: true,
    isBestseller: false,
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Crimson Red", "Obsidian Black"],
    features: ["Air rebound capsule", "Reinforced heel counter", "High abrasion rubber outsole"],
  },
  {
    id: 4,
    name: "Handcrafted Heritage Penny Loafer",
    cat: "Loafers",
    price: 8499,
    old: 9999,
    img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 11,
    rating: 5,
    reviews: 67,
    desc: "Timeless slip-on penny loafer crafted from supple calfskin. Features soft padded arch support and hand-stitched apron toe for versatile elegance.",
    badge: "Signature",
    isSale: false,
    isFeatured: true,
    isBestseller: false,
    sizes: ["40", "41", "42", "43"],
    colors: ["Mahogany Brown", "Classic Black"],
    features: ["Calfskin leather upper", "Padded arch support", "Slip-on convenience"],
  },
  {
    id: 5,
    name: "ErgoWalk Ortho Comfort Loafer",
    cat: "Comfort",
    price: 5999,
    old: 7499,
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 4,
    rating: 5,
    reviews: 142,
    desc: "Specially engineered orthopedic insole shoe designed for prolonged standing, diabetic foot care, and senior comfort. Zero break-in period required.",
    badge: "Orthopedic",
    isSale: true,
    isFeatured: false,
    isBestseller: true,
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Charcoal Grey", "Navy Blue"],
    features: ["Dual-density memory foam", "Extra wide toe-box", "Zero heel friction lining"],
  },
  {
    id: 6,
    name: "Oxford Cap-Toe Royal Black",
    cat: "Formal",
    price: 9999,
    old: 12500,
    img: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 7,
    rating: 5,
    reviews: 95,
    desc: "The quintessential gentleman's closed-lacing Oxford with a polished mirror cap-toe. High-durability Goodyear construction for lifetime elegance.",
    badge: "Luxury",
    isSale: false,
    isFeatured: true,
    isBestseller: false,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Pitch Black"],
    features: ["Closed lacing Oxford", "Leather lined interior", "Reinforced cap toe"],
  },
  {
    id: 7,
    name: "Veloce Carbon Trail Sneaker",
    cat: "Sneakers",
    price: 6999,
    old: 8499,
    img: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 16,
    rating: 4,
    reviews: 58,
    desc: "Rugged multi-terrain lightweight athletic shoe with reinforced toe bumper and water-repellent coating. Engineered for all-weather outdoor performance.",
    badge: "New Arrival",
    isSale: false,
    isFeatured: false,
    isBestseller: false,
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Stone Grey & Gold", "Midnight Olive"],
    features: ["Water-resistant textile", "Deep lug trail grip", "Shock absorbing midsole"],
  },
  {
    id: 8,
    name: "Tassel Monkstrap Executive",
    cat: "Loafers",
    price: 8999,
    old: 10999,
    img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 5,
    rating: 5,
    reviews: 43,
    desc: "Distinguished handcrafted double monkstrap featuring decorative hand-woven tassels and antique gold buckle hardware.",
    badge: "Exclusive",
    isSale: true,
    isFeatured: false,
    isBestseller: false,
    sizes: ["41", "42", "43", "44"],
    colors: ["Walnut Tan", "Antique Burgundy"],
    features: ["Double monk brass buckles", "Hand burnished patina", "Comfort inner sock"],
  },
];

export async function seedDatabase(): Promise<void> {
  // 1. Seed Superadmin
  const existingAdmin = await Admin.findOne({ username: "admin" });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);
    await Admin.create({
      username: "admin",
      email: "admin@hangubrandedshoes.com",
      passwordHash,
      name: "Super Admin",
      role: "superadmin",
      permissions: ["*"],
      isActive: true,
    });
    console.log("👤 Default Admin created: admin / admin123");
  }

  // 2. Seed Products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(SEED_PRODUCTS);
    console.log(`👟 ${SEED_PRODUCTS.length} Products seeded.`);
  }

  // 3. Seed Coupons
  const couponCount = await Coupon.countDocuments();
  if (couponCount === 0) {
    await Coupon.create([
      { code: "HANGU10", discountPercent: 10, minOrderAmount: 3000, isActive: true },
      { code: "VIP20", discountPercent: 20, minOrderAmount: 8000, isActive: true },
      { code: "EIDSPECIAL", discountPercent: 15, minOrderAmount: 5000, isActive: true },
    ]);
    console.log("🏷️ Default Coupons created: HANGU10, VIP20, EIDSPECIAL");
  }

  // 4. Seed Reviews
  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    await Review.create([
      {
        shoeName: "Skylite Slip-On Sneaker",
        userName: "Muhammad Bilal",
        city: "Peshawar",
        rating: 5,
        comment: "Bohot hi comfortable shoe hai! Hangu Branded Shoes ki packaging aur delivery speed mashallah zabardast thi. Peshawar mein 2 din mein deliver ho gaya.",
        status: "approved",
        verified: true,
        productId: 1,
      },
      {
        shoeName: "Classic Derby Formal Leather",
        userName: "Kamran Shah",
        city: "Islamabad",
        rating: 5,
        comment: "Pure 100% genuine leather hai. Office meetings ke liye liya tha, har kisi ne tareef ki. Finishing bilkul branded export quality jaisi hai.",
        status: "approved",
        verified: true,
        productId: 2,
      },
      {
        shoeName: "Urban Air-Glide Runner",
        userName: "Usman Tariq",
        city: "Lahore",
        rating: 5,
        comment: "Daily morning walk aur jogging ke liye best hai. Sole bohot soft hai aur knee pain bilkul nahi hota. 10/10 recommended!",
        status: "approved",
        verified: true,
        productId: 3,
      },
      {
        shoeName: "ErgoWalk Ortho Comfort Loafer",
        userName: "Dr. Farooq Khan",
        city: "Hangu",
        rating: 5,
        comment: "Mere walid sahab ke liye mangwaya tha. Unko chalne mein bohot aasaani hui. KP ke local craft aur modern comfort ka perfect combination.",
        status: "approved",
        verified: true,
        productId: 5,
      },
      {
        shoeName: "Handcrafted Heritage Penny Loafer",
        userName: "Zeeshan Ali",
        city: "Karachi",
        rating: 5,
        comment: "Karachi COD delivery sirf 3 din mein mili. Size 42 ordered aur bilkul perfect fit aya. Quality exceeds expectation!",
        status: "approved",
        verified: true,
        productId: 4,
      },
    ]);
    console.log("⭐ 5 Initial Customer Reviews seeded.");
  }

  // 5. Seed Settings
  let setting = await Setting.findOne();
  if (!setting) {
    await Setting.create({});
    console.log("⚙️ Store settings initialized.");
  }
}

// Standalone runner
if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  connectDB().then(async () => {
    await seedDatabase();
    await disconnectDB();
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  });
}

