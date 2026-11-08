/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { Product } from "../models/Product";
import { Admin } from "../models/Admin";

describe("👟 Product Management API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Product.deleteMany({});
    await Admin.deleteMany({});

    // Create admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);
    await Admin.create({
      username: "admin",
      email: "admin@hangubrandedshoes.com",
      passwordHash,
      name: "Super Admin",
      role: "admin",
      isActive: true,
    });

    const res = await request(app)
      .post("/api/admin/login")
      .send({ usernameOrEmail: "admin", password: "admin123" });
    adminToken = res.body.token;

    // Seed 2 products
    await Product.create([
      {
        id: 1,
        name: "Skylite Slip-On Sneaker",
        cat: "Sneakers",
        price: 6499,
        stock: 10,
        img: "https://example.com/shoe1.jpg",
        desc: "Comfortable sneaker",
        sizes: ["40", "41", "42"],
        colors: ["Black"],
      },
      {
        id: 2,
        name: "Classic Derby Formal",
        cat: "Formal",
        price: 9499,
        stock: 5,
        img: "https://example.com/shoe2.jpg",
        desc: "Genuine leather formal",
        sizes: ["41", "42"],
        colors: ["Brown"],
      },
    ]);
  });

  it("GET /api/products - returns list of products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
  });

  it("GET /api/products?cat=Sneakers - filters by category", async () => {
    const res = await request(app).get("/api/products?cat=Sneakers");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].cat).toBe("Sneakers");
  });

  it("GET /api/products?search=Derby - searches products by title", async () => {
    const res = await request(app).get("/api/products?search=Derby");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].name).toContain("Derby");
  });

  it("GET /api/products/categories - returns distinct categories with accurate counts", async () => {
    const res = await request(app).get("/api/products/categories");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    const sneakerCat = res.body.data.find((c: any) => c.name === "Sneakers");
    expect(sneakerCat.count).toBe(1);
  });

  it("GET /api/products/:id - returns product by ID", async () => {
    const res = await request(app).get("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Skylite Slip-On Sneaker");
  });

  it("GET /api/products/9999 - returns 404 for non-existent product", async () => {
    const res = await request(app).get("/api/products/9999");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/products - unauthorized without admin token", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Unauth Shoe",
      cat: "Sneakers",
      price: 5000,
      img: "https://example.com/shoe.jpg",
      desc: "test",
    });
    expect(res.status).toBe(401);
  });

  it("POST /api/products - creates new product when authenticated", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Handcrafted Penny Loafer",
        cat: "Loafers",
        price: 8499,
        stock: 12,
        img: "https://example.com/loafer.jpg",
        desc: "Handcrafted calfskin loafer",
        sizes: ["40", "41", "42"],
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
  });

  it("PUT /api/products/:id - updates product", async () => {
    const res = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 6999, badge: "Exclusive" });
    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(6999);
    expect(res.body.data.badge).toBe("Exclusive");
  });

  it("PATCH /api/products/:id/stock - adjusts product inventory stock", async () => {
    const res = await request(app)
      .patch("/api/products/1/stock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ delta: 5 });
    expect(res.status).toBe(200);
    expect(res.body.data.stock).toBe(15);
  });

  it("DELETE /api/products/:id - removes product", async () => {
    const res = await request(app)
      .delete("/api/products/2")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const check = await Product.findOne({ id: 2 });
    expect(check).toBeNull();
  });
});

