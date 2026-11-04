import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Order } from "../src/models/Order";
import { Product } from "../src/models/Product";
import { Admin } from "../src/models/Admin";

describe("📦 Order Lifecycle & Management API Tests", () => {
  let adminToken: string;
  let testOrderId: string;

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
    });
  });

  it("POST /api/orders - validates required customer and items data", async () => {
    const res = await request(app).post("/api/orders").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/orders - successfully creates order and deducts product stock", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Ahmad Khan",
          phone: "03459680373",
          city: "Hangu",
          address: "Main Bazar, Near Jamia Masjid",
        },
        items: [
          {
            productId: 1,
            name: "Skylite Slip-On Sneaker",
            quantity: 2,
            size: "42",
          },
        ],
        paymentMethod: "cod",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBeDefined();
    testOrderId = res.body.data.orderId;

    // Verify stock deduction in database: 20 - 2 = 18
    const updatedProduct = await Product.findOne({ id: 1 });
    expect(updatedProduct?.stock).toBe(18);
  });

  it("GET /api/orders/track - tracks order by orderId", async () => {
    // Create an order first
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Bilal",
          phone: "03001234567",
          city: "Peshawar",
          address: "University Road",
        },
        items: [{ productId: 1, quantity: 1, size: "41" }],
      });
    const orderId = createRes.body.data.orderId;

    const res = await request(app).get(`/api/orders/track?orderId=${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customer.name).toBe("Bilal");
  });

  it("PATCH /api/orders/:id/cancel - cancels order and restores product stock", async () => {
    // Place order for 2 pairs
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Usman",
          phone: "03119876543",
          city: "Kohat",
          address: "Cantt",
        },
        items: [{ productId: 1, quantity: 2, size: "43" }],
      });
    const orderId = createRes.body.data.orderId;

    // Stock was 18 after deduction
    let product = await Product.findOne({ id: 1 });
    expect(product?.stock).toBe(18);

    // Cancel order
    const cancelRes = await request(app)
      .patch(`/api/orders/${orderId}/cancel`)
      .send({ reason: "Customer changed mind" });

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.status).toBe("cancelled");

    // Stock restored to 20
    product = await Product.findOne({ id: 1 });
    expect(product?.stock).toBe(20);
  });

  it("GET /api/orders - admin lists all orders", async () => {
    await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Test User", phone: "03331112233", city: "Lahore", address: "Model Town" },
        items: [{ productId: 1, quantity: 1, size: "42" }],
      });

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("PATCH /api/orders/:id/status - admin updates order status to dispatched with courier", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Test User 2", phone: "03331112233", city: "Islamabad", address: "F-7" },
        items: [{ productId: 1, quantity: 1, size: "42" }],
      });
    const orderId = createRes.body.data.orderId;

    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "dispatched",
        courierName: "Trax Express",
        trackingNumber: "TRX-987654321",
        note: "Handed over to rider",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("dispatched");
    expect(res.body.data.courierName).toBe("Trax Express");
    expect(res.body.data.trackingNumber).toBe("TRX-987654321");
  });

  it("DELETE /api/orders/:id - admin deletes order", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: { name: "Delete User", phone: "03330000000", city: "Hangu", address: "Test" },
        items: [{ productId: 1, quantity: 1, size: "40" }],
      });
    const orderId = createRes.body.data.orderId;

    const res = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const check = await Order.findOne({ orderId });
    expect(check).toBeNull();
  });

  it("GET /api/orders/recent - returns empty array when no orders exist", async () => {
    const res = await request(app).get("/api/orders/recent");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toEqual([]);
  });

  it("GET /api/orders/recent - returns genuine sales with strict privacy protection", async () => {
    // Create an order with full customer details
    await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Muhammad Bilal",
          phone: "03001234567",
          city: "Lahore",
          address: "House 123, Street 4, Gulberg III",
        },
        items: [
          {
            productId: 1,
            name: "Skylite Slip-On Sneaker",
            quantity: 1,
            size: "43",
          },
        ],
        paymentMethod: "cod",
      });

    const res = await request(app).get("/api/orders/recent");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);

    const sale = res.body.data[0];
    expect(sale.customerName).toBe("Muhammad B.");
    expect(sale.city).toBe("Lahore");
    expect(sale.name).toBe("Skylite Slip-On Sneaker");
    expect(sale.size).toBe("43");
    expect(sale.price).toBe(6000);
    expect(sale.createdAt).toBeDefined();

    // STRICT PRIVACY CHECKS: No sensitive customer data exposed
    expect(res.text).not.toContain("03001234567");
    expect(res.text).not.toContain("House 123");
    expect(res.text).not.toContain("Gulberg III");
  });
});

