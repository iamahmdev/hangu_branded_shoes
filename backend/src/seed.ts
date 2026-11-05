import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Product } from "./models/Product.js";
import { Review } from "./models/Review.js";
import { Setting } from "./models/Setting.js";

export const SEED_PRODUCTS = [
  {
    "id": 1,
    "name": "Hangu Heritage Oxford",
    "cat": "Sneakers",
    "price": 3499,
    "old": 4374,
    "img": "/images/shoes/IMG_3091.jpg",
    "images": [
      "/images/shoes/IMG_3091.jpg"
    ],
    "stock": 10,
    "rating": 5,
    "reviews": 15,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "New Arrival",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 2,
    "name": "Airflex Ultra Runner",
    "cat": "Formal",
    "price": 3999,
    "old": 5199,
    "img": "/images/shoes/IMG_3092.jpg",
    "images": [
      "/images/shoes/IMG_3092.jpg"
    ],
    "stock": 13,
    "rating": 5,
    "reviews": 22,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Bestseller",
    "isSale": false,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 3,
    "name": "Classic Royal Derby",
    "cat": "Loafers",
    "price": 4499,
    "old": 6074,
    "img": "/images/shoes/IMG_3093.jpg",
    "images": [
      "/images/shoes/IMG_3093.jpg"
    ],
    "stock": 16,
    "rating": 5,
    "reviews": 29,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "100% Pure Leather",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 4,
    "name": "KP Handcrafted Penny Loafer",
    "cat": "Comfort",
    "price": 4999,
    "old": 6249,
    "img": "/images/shoes/IMG_3094.jpg",
    "images": [
      "/images/shoes/IMG_3094.jpg"
    ],
    "stock": 19,
    "rating": 5,
    "reviews": 36,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Featured",
    "isSale": false,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 5,
    "name": "CloudWalk Ortho Slip-On",
    "cat": "Boots",
    "price": 5299,
    "old": 6889,
    "img": "/images/shoes/IMG_3095.jpg",
    "images": [
      "/images/shoes/IMG_3095.jpg"
    ],
    "stock": 22,
    "rating": 5,
    "reviews": 43,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Top Rated",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 6,
    "name": "Executive Cap-Toe Formal",
    "cat": "Sneakers",
    "price": 5499,
    "old": 7424,
    "img": "/images/shoes/IMG_3096.jpg",
    "images": [
      "/images/shoes/IMG_3096.jpg"
    ],
    "stock": 25,
    "rating": 5,
    "reviews": 50,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Exclusive",
    "isSale": false,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 7,
    "name": "Apex Performance Sneaker",
    "cat": "Formal",
    "price": 5999,
    "old": 7499,
    "img": "/images/shoes/IMG_3097.jpg",
    "images": [
      "/images/shoes/IMG_3097.jpg"
    ],
    "stock": 28,
    "rating": 5,
    "reviews": 57,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Comfort Edition",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 8,
    "name": "Venetian Soft Leather Moccasin",
    "cat": "Loafers",
    "price": 6499,
    "old": 8449,
    "img": "/images/shoes/IMG_3098.jpg",
    "images": [
      "/images/shoes/IMG_3098.jpg"
    ],
    "stock": 31,
    "rating": 5,
    "reviews": 64,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Handcrafted",
    "isSale": false,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 9,
    "name": "Khyber Rugged Leather Boot",
    "cat": "Comfort",
    "price": 6999,
    "old": 9449,
    "img": "/images/shoes/IMG_3099.jpg",
    "images": [
      "/images/shoes/IMG_3099.jpg"
    ],
    "stock": 34,
    "rating": 5,
    "reviews": 71,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "New Arrival",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 10,
    "name": "Monkstrap Antique Burnished",
    "cat": "Boots",
    "price": 7499,
    "old": 9374,
    "img": "/images/shoes/IMG_3100.jpg",
    "images": [
      "/images/shoes/IMG_3100.jpg"
    ],
    "stock": 12,
    "rating": 5,
    "reviews": 78,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Bestseller",
    "isSale": false,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 11,
    "name": "Veloce Carbon Street Runner",
    "cat": "Sneakers",
    "price": 7999,
    "old": 10399,
    "img": "/images/shoes/IMG_3101.jpg",
    "images": [
      "/images/shoes/IMG_3101.jpg"
    ],
    "stock": 15,
    "rating": 5,
    "reviews": 85,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "100% Pure Leather",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 12,
    "name": "Signature Brogue Gentleman",
    "cat": "Formal",
    "price": 8499,
    "old": 11474,
    "img": "/images/shoes/IMG_3102.jpg",
    "images": [
      "/images/shoes/IMG_3102.jpg"
    ],
    "stock": 18,
    "rating": 5,
    "reviews": 92,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Featured",
    "isSale": false,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 13,
    "name": "ErgoStep Memory Foam Walker",
    "cat": "Loafers",
    "price": 8999,
    "old": 11249,
    "img": "/images/shoes/IMG_3103.jpg",
    "images": [
      "/images/shoes/IMG_3103.jpg"
    ],
    "stock": 21,
    "rating": 5,
    "reviews": 99,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Top Rated",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 14,
    "name": "Chelsea Suede Ankle Boot",
    "cat": "Comfort",
    "price": 3499,
    "old": 4549,
    "img": "/images/shoes/IMG_3105.jpg",
    "images": [
      "/images/shoes/IMG_3105.jpg"
    ],
    "stock": 24,
    "rating": 5,
    "reviews": 21,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Exclusive",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 15,
    "name": "Urban Pulse Lifestyle Trainer",
    "cat": "Boots",
    "price": 3999,
    "old": 5399,
    "img": "/images/shoes/IMG_3106.jpg",
    "images": [
      "/images/shoes/IMG_3106.jpg"
    ],
    "stock": 27,
    "rating": 5,
    "reviews": 28,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Comfort Edition",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 16,
    "name": "Classic Wholecut Formal",
    "cat": "Sneakers",
    "price": 4499,
    "old": 5624,
    "img": "/images/shoes/IMG_3107.jpg",
    "images": [
      "/images/shoes/IMG_3107.jpg"
    ],
    "stock": 30,
    "rating": 5,
    "reviews": 35,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Handcrafted",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 17,
    "name": "Driving Loafer Gripped Sole",
    "cat": "Formal",
    "price": 4999,
    "old": 6499,
    "img": "/images/shoes/IMG_3108.jpg",
    "images": [
      "/images/shoes/IMG_3108.jpg"
    ],
    "stock": 33,
    "rating": 5,
    "reviews": 42,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "New Arrival",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 18,
    "name": "Breeze Knit Athletic Sneaker",
    "cat": "Loafers",
    "price": 5299,
    "old": 7154,
    "img": "/images/shoes/IMG_3109.jpg",
    "images": [
      "/images/shoes/IMG_3109.jpg"
    ],
    "stock": 11,
    "rating": 5,
    "reviews": 49,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Bestseller",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 19,
    "name": "Imperial Wingtip Derby",
    "cat": "Comfort",
    "price": 5499,
    "old": 6874,
    "img": "/images/shoes/IMG_3110.jpg",
    "images": [
      "/images/shoes/IMG_3110.jpg"
    ],
    "stock": 14,
    "rating": 5,
    "reviews": 56,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "100% Pure Leather",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 20,
    "name": "Zenith Lightweight Runner",
    "cat": "Boots",
    "price": 5999,
    "old": 7799,
    "img": "/images/shoes/IMG_3111.jpg",
    "images": [
      "/images/shoes/IMG_3111.jpg"
    ],
    "stock": 17,
    "rating": 5,
    "reviews": 63,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Featured",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 21,
    "name": "Sovereign Double Monkstrap",
    "cat": "Sneakers",
    "price": 6499,
    "old": 8774,
    "img": "/images/shoes/IMG_3112.jpg",
    "images": [
      "/images/shoes/IMG_3112.jpg"
    ],
    "stock": 20,
    "rating": 5,
    "reviews": 70,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Top Rated",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 22,
    "name": "Comfort Fit Diabetic Daily",
    "cat": "Formal",
    "price": 6999,
    "old": 8749,
    "img": "/images/shoes/IMG_3113.jpg",
    "images": [
      "/images/shoes/IMG_3113.jpg"
    ],
    "stock": 23,
    "rating": 5,
    "reviews": 77,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Exclusive",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 23,
    "name": "Chukka Hand-Stitched Boot",
    "cat": "Loafers",
    "price": 7499,
    "old": 9749,
    "img": "/images/shoes/IMG_3114.jpg",
    "images": [
      "/images/shoes/IMG_3114.jpg"
    ],
    "stock": 26,
    "rating": 5,
    "reviews": 84,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Comfort Edition",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 24,
    "name": "Retro Court Vintage Sneaker",
    "cat": "Comfort",
    "price": 7999,
    "old": 10799,
    "img": "/images/shoes/IMG_3115.jpg",
    "images": [
      "/images/shoes/IMG_3115.jpg"
    ],
    "stock": 29,
    "rating": 5,
    "reviews": 91,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Handcrafted",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 25,
    "name": "Monarch Patent Tuxedo Oxford",
    "cat": "Boots",
    "price": 8499,
    "old": 10624,
    "img": "/images/shoes/IMG_3116.jpg",
    "images": [
      "/images/shoes/IMG_3116.jpg"
    ],
    "stock": 32,
    "rating": 5,
    "reviews": 98,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "New Arrival",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 26,
    "name": "Riviera Tassel Leather Loafer",
    "cat": "Sneakers",
    "price": 8999,
    "old": 11699,
    "img": "/images/shoes/IMG_3117.jpg",
    "images": [
      "/images/shoes/IMG_3117.jpg"
    ],
    "stock": 10,
    "rating": 5,
    "reviews": 20,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Bestseller",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 27,
    "name": "AeroGlide Daily Jogger",
    "cat": "Formal",
    "price": 3499,
    "old": 4724,
    "img": "/images/shoes/IMG_3118.jpg",
    "images": [
      "/images/shoes/IMG_3118.jpg"
    ],
    "stock": 13,
    "rating": 5,
    "reviews": 27,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "100% Pure Leather",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 28,
    "name": "Highlander Combat Ankle Boot",
    "cat": "Loafers",
    "price": 3999,
    "old": 4999,
    "img": "/images/shoes/IMG_3119.jpg",
    "images": [
      "/images/shoes/IMG_3119.jpg"
    ],
    "stock": 16,
    "rating": 5,
    "reviews": 34,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Featured",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 29,
    "name": "Prestige Cap-Toe Brown Derby",
    "cat": "Comfort",
    "price": 4499,
    "old": 5849,
    "img": "/images/shoes/IMG_3120.jpg",
    "images": [
      "/images/shoes/IMG_3120.jpg"
    ],
    "stock": 19,
    "rating": 5,
    "reviews": 41,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Top Rated",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 30,
    "name": "Air Cushion Pro Athletic",
    "cat": "Boots",
    "price": 4999,
    "old": 6749,
    "img": "/images/shoes/IMG_3121.jpg",
    "images": [
      "/images/shoes/IMG_3121.jpg"
    ],
    "stock": 22,
    "rating": 5,
    "reviews": 48,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Exclusive",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 31,
    "name": "Tuscan Pebble Leather Loafer",
    "cat": "Sneakers",
    "price": 5299,
    "old": 6624,
    "img": "/images/shoes/IMG_3122.jpg",
    "images": [
      "/images/shoes/IMG_3122.jpg"
    ],
    "stock": 25,
    "rating": 5,
    "reviews": 55,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Comfort Edition",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 32,
    "name": "Metropolitan Formal Oxford",
    "cat": "Formal",
    "price": 5499,
    "old": 7149,
    "img": "/images/shoes/IMG_3123.jpg",
    "images": [
      "/images/shoes/IMG_3123.jpg"
    ],
    "stock": 28,
    "rating": 5,
    "reviews": 62,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Handcrafted",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 33,
    "name": "FlexMotion Walking Shoe",
    "cat": "Loafers",
    "price": 5999,
    "old": 8099,
    "img": "/images/shoes/IMG_3124.jpg",
    "images": [
      "/images/shoes/IMG_3124.jpg"
    ],
    "stock": 31,
    "rating": 5,
    "reviews": 69,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "New Arrival",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 34,
    "name": "Sahara Suede Desert Boot",
    "cat": "Comfort",
    "price": 6499,
    "old": 8124,
    "img": "/images/shoes/IMG_3125.jpg",
    "images": [
      "/images/shoes/IMG_3125.jpg"
    ],
    "stock": 34,
    "rating": 5,
    "reviews": 76,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Bestseller",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 35,
    "name": "Phantom All-Black Street Sneaker",
    "cat": "Boots",
    "price": 6999,
    "old": 9099,
    "img": "/images/shoes/IMG_3126.jpg",
    "images": [
      "/images/shoes/IMG_3126.jpg"
    ],
    "stock": 12,
    "rating": 5,
    "reviews": 83,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "100% Pure Leather",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 36,
    "name": "Khyber Artisan Slip-On",
    "cat": "Sneakers",
    "price": 7499,
    "old": 10124,
    "img": "/images/shoes/IMG_3127.jpg",
    "images": [
      "/images/shoes/IMG_3127.jpg"
    ],
    "stock": 15,
    "rating": 5,
    "reviews": 90,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Featured",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 37,
    "name": "Marathon Featherlight Trainer",
    "cat": "Formal",
    "price": 7999,
    "old": 9999,
    "img": "/images/shoes/IMG_3128.jpg",
    "images": [
      "/images/shoes/IMG_3128.jpg"
    ],
    "stock": 18,
    "rating": 5,
    "reviews": 97,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Top Rated",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 38,
    "name": "Milano Horsebit Gold Loafer",
    "cat": "Loafers",
    "price": 8499,
    "old": 11049,
    "img": "/images/shoes/IMG_3129.jpg",
    "images": [
      "/images/shoes/IMG_3129.jpg"
    ],
    "stock": 21,
    "rating": 5,
    "reviews": 19,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Exclusive",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 39,
    "name": "Elite Goodyear Welted Derby",
    "cat": "Comfort",
    "price": 8999,
    "old": 12149,
    "img": "/images/shoes/IMG_3130.jpg",
    "images": [
      "/images/shoes/IMG_3130.jpg"
    ],
    "stock": 24,
    "rating": 5,
    "reviews": 26,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Comfort Edition",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 40,
    "name": "Nordic Winter Leather Boot",
    "cat": "Boots",
    "price": 3499,
    "old": 4374,
    "img": "/images/shoes/IMG_3131.jpg",
    "images": [
      "/images/shoes/IMG_3131.jpg"
    ],
    "stock": 27,
    "rating": 5,
    "reviews": 33,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Handcrafted",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 41,
    "name": "Strata Mesh Breathable Runner",
    "cat": "Sneakers",
    "price": 3999,
    "old": 5199,
    "img": "/images/shoes/IMG_3132.jpg",
    "images": [
      "/images/shoes/IMG_3132.jpg"
    ],
    "stock": 30,
    "rating": 5,
    "reviews": 40,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "New Arrival",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 42,
    "name": "Diplomat Polished Black Oxford",
    "cat": "Formal",
    "price": 4499,
    "old": 6074,
    "img": "/images/shoes/IMG_3133.jpg",
    "images": [
      "/images/shoes/IMG_3133.jpg"
    ],
    "stock": 33,
    "rating": 5,
    "reviews": 47,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Bestseller",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 43,
    "name": "Velvet Touch Padded Loafer",
    "cat": "Loafers",
    "price": 4999,
    "old": 6249,
    "img": "/images/shoes/IMG_3134.jpg",
    "images": [
      "/images/shoes/IMG_3134.jpg"
    ],
    "stock": 11,
    "rating": 5,
    "reviews": 54,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "100% Pure Leather",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 44,
    "name": "Active Dynamic Cushioned Sneaker",
    "cat": "Comfort",
    "price": 5299,
    "old": 6889,
    "img": "/images/shoes/IMG_3135.jpg",
    "images": [
      "/images/shoes/IMG_3135.jpg"
    ],
    "stock": 14,
    "rating": 5,
    "reviews": 61,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Featured",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 45,
    "name": "Frontier Rugged Casual Boot",
    "cat": "Boots",
    "price": 5499,
    "old": 7424,
    "img": "/images/shoes/IMG_3136.jpg",
    "images": [
      "/images/shoes/IMG_3136.jpg"
    ],
    "stock": 17,
    "rating": 5,
    "reviews": 68,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Top Rated",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 46,
    "name": "Regal Hand-Finished Brogue",
    "cat": "Sneakers",
    "price": 5999,
    "old": 7499,
    "img": "/images/shoes/IMG_3138.jpg",
    "images": [
      "/images/shoes/IMG_3138.jpg"
    ],
    "stock": 20,
    "rating": 5,
    "reviews": 75,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Exclusive",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 47,
    "name": "Quantum Energy Sport Runner",
    "cat": "Formal",
    "price": 6499,
    "old": 8449,
    "img": "/images/shoes/IMG_3139.jpg",
    "images": [
      "/images/shoes/IMG_3139.jpg"
    ],
    "stock": 23,
    "rating": 5,
    "reviews": 82,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Comfort Edition",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 48,
    "name": "Heritage Horsebit Moccasin",
    "cat": "Loafers",
    "price": 6999,
    "old": 9449,
    "img": "/images/shoes/IMG_3140.jpg",
    "images": [
      "/images/shoes/IMG_3140.jpg"
    ],
    "stock": 26,
    "rating": 5,
    "reviews": 89,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Handcrafted",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 49,
    "name": "Savile Row Formal Derby",
    "cat": "Comfort",
    "price": 7499,
    "old": 9374,
    "img": "/images/shoes/IMG_3141.jpg",
    "images": [
      "/images/shoes/IMG_3141.jpg"
    ],
    "stock": 29,
    "rating": 5,
    "reviews": 96,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "New Arrival",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 50,
    "name": "Peak Performance Outdoor Sneaker",
    "cat": "Boots",
    "price": 7999,
    "old": 10399,
    "img": "/images/shoes/IMG_3142.jpg",
    "images": [
      "/images/shoes/IMG_3142.jpg"
    ],
    "stock": 32,
    "rating": 5,
    "reviews": 18,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Bestseller",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 51,
    "name": "Grandmaster Leather Loafer",
    "cat": "Sneakers",
    "price": 8499,
    "old": 11474,
    "img": "/images/shoes/IMG_3143.jpg",
    "images": [
      "/images/shoes/IMG_3143.jpg"
    ],
    "stock": 10,
    "rating": 5,
    "reviews": 25,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "100% Pure Leather",
    "isSale": true,
    "isFeatured": false,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Midnight Blue",
      "Pure White"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 52,
    "name": "Vanguard Tactical Boot",
    "cat": "Formal",
    "price": 8999,
    "old": 11249,
    "img": "/images/shoes/IMG_3144.jpg",
    "images": [
      "/images/shoes/IMG_3144.jpg"
    ],
    "stock": 13,
    "rating": 5,
    "reviews": 32,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Featured",
    "isSale": false,
    "isFeatured": false,
    "isBestseller": true,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Jet Black",
      "Deep Brown"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  },
  {
    "id": 53,
    "name": "Hangu Masterpiece Edition Shoe",
    "cat": "Loafers",
    "price": 3499,
    "old": 4549,
    "img": "/images/shoes/IMG_3145.jpg",
    "images": [
      "/images/shoes/IMG_3145.jpg"
    ],
    "stock": 16,
    "rating": 5,
    "reviews": 39,
    "desc": "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan.",
    "badge": "Top Rated",
    "isSale": true,
    "isFeatured": true,
    "isBestseller": false,
    "isActive": true,
    "sizes": [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Walnut Tan",
      "Charcoal"
    ],
    "features": [
      "100% Authentic Hand-Finished Craftsmanship",
      "Shock-Absorbing Memory Sole",
      "Breathable Anti-Odor Lining",
      "Cash on Delivery Nationwide across Pakistan"
    ]
  }
];

export async function seedDatabase(): Promise<void> {
  // 1. Seed Admin
  const existingAdmin = await Admin.findOne({ username: "admin" });
  if (!existingAdmin) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);
    await Admin.create({
      username: "admin",
      email: "admin@hangubrandedshoes.com",
      passwordHash,
      name: "Admin",
      role: "admin",
      permissions: ["*"],
      isActive: true,
    });
    console.log("👤 Default Admin account verified/created.");
  }

  // 2. Seed Products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(SEED_PRODUCTS);
    console.log(`👟 ${SEED_PRODUCTS.length} Products seeded.`);
  }

  // 3. Seed Reviews
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

