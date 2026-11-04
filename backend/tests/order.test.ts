/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Order } from "../src/models/Order";
import { Product } from "../src/models/Product";
import { Admin } from "../src/models/Admin";

describe("📦 Order Lifecycle, EasyPaisa Verification & Security API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Order.deleteMany({});
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

    // Seed product
    await Product.create({
      id: 1,
      name: "Skylite Slip-On Sneaker",
      cat: "Sneakers",
      price: 6000,
      stock: 20,
      img: "https://example.com/shoe1.jpg",
      desc: "Comfortable sneaker",
      isActive: true,
    });
  });

  it("POST /api/orders - rejects missing TID", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Ahmad Khan",
          phone: "03459680373",
          city: "Hangu",
          address: "Main Bazar",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Transaction ID (TID) is required");
  });

  it("POST /api/orders - blocks duplicate EasyPaisa TIDs", async () => {
    // 1st order with TID
    const res1 = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Customer One",
          phone: "03001111111",
          city: "Kohat",
          address: "Bazar",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        transactionId: "TID-DUPLICATE-999",
      });
    expect(res1.status).toBe(201);

    // 2nd order with SAME TID must be rejected
    const res2 = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Customer Two",
          phone: "03002222222",
          city: "Peshawar",
          address: "Cantt",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        transactionId: "TID-DUPLICATE-999",
      });

    expect(res2.status).toBe(400);
    expect(res2.body.success).toBe(false);
    expect(res2.body.message).toContain("already been submitted");
  });

  it("POST /api/orders - server calculates totals from DB and deducts stock", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Ahmad Khan",
          phone: "03459680373",
          city: "Hangu",
          address: "Main Bazar, Near Jamia Masjid",
        },
        items: [{ productId: 1, quantity: 2, size: "42" }],
        transactionId: "TID-EP-100234",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBeDefined();
    expect(res.body.data.paymentMethod).toBe("easypaisa");
    expect(res.body.data.paymentStatus).toBe("pending_verification");
    expect(res.body.data.subtotal).toBe(12000); // 2 * 6000
    expect(res.body.data.totalAmount).toBe(12000); // Free shipping over 5000

    // Stock deducted: 20 - 2 = 18
    const updatedProduct = await Product.findOne({ id: 1 });
    expect(updatedProduct?.stock).toBe(18);
  });

  it("PATCH /api/orders/:id/status - blocks confirming order before payment is marked 'paid'", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Test User", phone: "03001234567", city: "Lahore", address: "DHA" },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        transactionId: "TID-UNVERIFIED-888",
      });
    const orderId = createRes.body.data.orderId;

    // Attempt to set status to confirmed while payment is pending_verification
    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "confirmed" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("cannot be confirmed until payment status is marked as 'paid'");
  });

  it("PATCH /api/orders/:id/payment - admin marks payment as paid, then confirms order", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Test User 2", phone: "03001234567", city: "Lahore", address: "Gulberg" },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        transactionId: "TID-VERIFY-777",
      });
    const orderId = createRes.body.data.orderId;

    // 1. Mark payment as paid
    const payRes = await request(app)
      .patch(`/api/orders/${orderId}/payment`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ paymentStatus: "paid" });

    expect(payRes.status).toBe(200);
    expect(payRes.body.data.paymentStatus).toBe("paid");

    // 2. Now confirm order
    const statusRes = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "confirmed",
        courierName: "TCS Express",
        trackingNumber: "TCS-11223344",
      });

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.status).toBe("confirmed");
  });

  it("GET /api/orders/track - tracks order by orderId", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Bilal", phone: "03001234567", city: "Peshawar", address: "University Road" },
        items: [{ productId: 1, quantity: 1, size: "41" }],
        transactionId: "TID-TRACK-555",
      });
    const orderId = createRes.body.data.orderId;

    const res = await request(app).get(`/api/orders/track?orderId=${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customer.name).toBe("Bilal");
  });

  it("PATCH /api/orders/:id/cancel - cancels order and restores product stock", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Usman", phone: "03119876543", city: "Kohat", address: "Cantt" },
        items: [{ productId: 1, quantity: 2, size: "43" }],
        transactionId: "TID-CANCEL-444",
      });
    const orderId = createRes.body.data.orderId;

    let product = await Product.findOne({ id: 1 });
    expect(product?.stock).toBe(18);

    const cancelRes = await request(app)
      .patch(`/api/orders/${orderId}/cancel`)
      .send({ reason: "Customer changed mind" });

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.status).toBe("cancelled");

    product = await Product.findOne({ id: 1 });
    expect(product?.stock).toBe(20);
  });

  it("GET /api/orders/recent - returns genuine sales with strict customer privacy", async () => {
    await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Muhammad Bilal",
          phone: "03001234567",
          city: "Lahore",
          address: "House 123, Street 4, Gulberg III",
        },
        items: [{ productId: 1, name: "Skylite Slip-On Sneaker", quantity: 1, size: "43" }],
        transactionId: "TID-RECENT-333",
      });

    const res = await request(app).get("/api/orders/recent");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);

    const sale = res.body.data[0];
    expect(sale.customerName).toBe("Muhammad B.");
    expect(sale.city).toBe("Lahore");
    expect(sale.name).toBe("Skylite Slip-On Sneaker");
    expect(res.text).not.toContain("03001234567");
    expect(res.text).not.toContain("House 123");
  });
});
