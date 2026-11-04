/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Order } from "../src/models/Order";
import { Product } from "../src/models/Product";
import { Admin } from "../src/models/Admin";
import { Setting } from "../src/models/Setting";

describe("📦 Order Lifecycle, COD, EasyPaisa & Fake Order Protection Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Setting.deleteMany({});

    // Seed Store Settings
    await Setting.create({
      shopName: "Hangu Branded Shoes",
      phone: "0333-3147691",
      whatsappNumber: "923333147691",
      address: "Main Commercial Bazar, Hangu District, KP",
      shopTiming: "8:00 AM to 5:00 PM",
      shippingFee: 250,
      freeShippingThreshold: 5000,
      enableCod: true,
      codFee: 100,
      blockedPhoneNumbers: ["03339999999"],
      easypaisaNumber: "03333147691",
      easypaisaTitle: "Hangu Branded Shoes",
    });

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

    // Seed product with initial stock 20
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

  // --------------------------------------------------------------------------
  // CASH ON DELIVERY (COD) ORDER TESTS
  // --------------------------------------------------------------------------

  it("POST /api/orders (COD) - creates order, decrements stock, sets awaiting_confirmation", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Ahmad Khan",
          phone: "03459680373",
          city: "Hangu",
          address: "House 12, Mohallah Qazi, Main Bazar",
        },
        items: [{ productId: 1, quantity: 2, size: "42" }],
        paymentMethod: "cod",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBeDefined();
    expect(res.body.data.paymentMethod).toBe("cod");
    expect(res.body.data.paymentStatus).toBe("cod_pending");
    expect(res.body.data.status).toBe("awaiting_confirmation");
    expect(res.body.data.subtotal).toBe(12000); // 2 * 6000
    expect(res.body.data.codFee).toBe(100);
    expect(res.body.data.totalAmount).toBe(12100); // 12000 + 0 free shipping + 100 cod fee

    // Stock reserved: 20 - 2 = 18
    const updatedProduct = await Product.findOne({ id: 1 });
    expect(updatedProduct?.stock).toBe(18);
  });

  it("PATCH /api/orders/:id/status (COD) - admin confirms COD order directly without requiring 'paid'", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Farhan Ali",
          phone: "03001234567",
          city: "Peshawar",
          address: "Sector F-4, Phase 6, Hayatabad",
        },
        items: [{ productId: 1, quantity: 1, size: "41" }],
        paymentMethod: "cod",
      });
    const orderId = createRes.body.data.orderId;

    // Admin confirms after speaking to customer on phone/WhatsApp
    const confirmRes = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "confirmed",
        deliveryNote: "Customer confirmed size 41 via phone call",
      });

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.status).toBe("confirmed");
    expect(confirmRes.body.data.deliveryNote).toBe("Customer confirmed size 41 via phone call");
  });

  it("PATCH /api/orders/:id/cash-collected - sets payment to paid and order to delivered", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Jamil Shah",
          phone: "03331234567",
          city: "Kohat",
          address: "Shop 4, Cantt Commercial Plaza",
        },
        items: [{ productId: 1, quantity: 1, size: "43" }],
        paymentMethod: "cod",
      });
    const orderId = createRes.body.data.orderId;

    const res = await request(app)
      .patch(`/api/orders/${orderId}/cash-collected`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ note: "Rider handed cash to cashier" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.paymentStatus).toBe("paid");
    expect(res.body.data.status).toBe("delivered");
  });

  it("PATCH /api/orders/:id/fake - cancels order, restores stock, and blocks phone", async () => {
    const phoneToBlock = "03215554433";
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Suspicious User",
          phone: phoneToBlock,
          city: "Islamabad",
          address: "Fake street 123, Sector G-9",
        },
        items: [{ productId: 1, quantity: 2, size: "42" }],
        paymentMethod: "cod",
      });
    const orderId = createRes.body.data.orderId;

    let product = await Product.findOne({ id: 1 });
    expect(product?.stock).toBe(18); // 20 - 2

    const fakeRes = await request(app)
      .patch(`/api/orders/${orderId}/fake`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        blockPhone: true,
        reason: "Customer phone unreachable after 5 attempts",
      });

    expect(fakeRes.status).toBe(200);
    expect(fakeRes.body.success).toBe(true);
    expect(fakeRes.body.data.status).toBe("cancelled");

    // Stock must be restored: 18 + 2 = 20
    product = await Product.findOne({ id: 1 });
    expect(product?.stock).toBe(20);

    // Phone must be added to blocked list in Setting
    const settings = await Setting.findOne();
    expect(settings?.blockedPhoneNumbers).toContain(phoneToBlock);
  });

  // --------------------------------------------------------------------------
  // FAKE ORDER PROTECTION RULES
  // --------------------------------------------------------------------------

  it("POST /api/orders - blocks bot filling honeypot trap", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Spam Bot",
          phone: "03001234567",
          city: "Lahore",
          address: "Automated address 12345",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "cod",
        hp: "http://spam-link.com", // Honeypot filled
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/orders - rejects invalid Pakistani mobile number", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Invalid Number",
          phone: "12345678", // Not a valid 03XX Pakistani number
          city: "Lahore",
          address: "House 12, Street 3, Gulberg",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "cod",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("valid Pakistani mobile number");
  });

  it("POST /api/orders - rejects incomplete/short delivery address (< 10 chars)", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Short Address",
          phone: "03001234567",
          city: "Lahore",
          address: "Bazar", // only 5 characters
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "cod",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("complete delivery address");
  });

  it("POST /api/orders - rejects order from blocked phone number (403)", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Blocked Caller",
          phone: "03339999999", // in blockedPhoneNumbers list
          city: "Lahore",
          address: "House 55, Street 10, Model Town",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "cod",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("restricted from placing orders");
  });

  it("POST /api/orders - enforces 24-hour rate limit (max 3 orders per phone)", async () => {
    const phone = "03451122334";
    const payload = {
      customer: {
        name: "Repeat Customer",
        phone,
        city: "Kohat",
        address: "House 10, Sector 2, KDA Colony",
      },
      items: [{ productId: 1, quantity: 1, size: "42" }],
      paymentMethod: "cod",
    };

    // 3 orders succeed
    for (let i = 0; i < 3; i++) {
      const res = await request(app).post("/api/orders").send(payload);
      expect(res.status).toBe(201);
    }

    // 4th order within 24h must be rejected
    const fourthRes = await request(app).post("/api/orders").send(payload);
    expect(fourthRes.status).toBe(429);
    expect(fourthRes.body.success).toBe(false);
    expect(fourthRes.body.message).toContain("maximum 3 orders per phone number");
  });

  // --------------------------------------------------------------------------
  // EASYPAISA ORDER TESTS
  // --------------------------------------------------------------------------

  it("POST /api/orders (EasyPaisa) - rejects missing TID", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Ahmad Khan",
          phone: "03459680373",
          city: "Hangu",
          address: "Main Bazar, Near Jamia Masjid",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "easypaisa",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Transaction ID (TID) is required");
  });

  it("POST /api/orders (EasyPaisa) - blocks duplicate EasyPaisa TIDs", async () => {
    // 1st order with TID
    const res1 = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Customer One",
          phone: "03001111111",
          city: "Kohat",
          address: "Main Bazar, Near Bus Stand",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "easypaisa",
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
          address: "Mall Road, Peshawar Cantt",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "easypaisa",
        transactionId: "TID-DUPLICATE-999",
      });

    expect(res2.status).toBe(400);
    expect(res2.body.success).toBe(false);
    expect(res2.body.message).toContain("already been submitted");
  });

  it("PATCH /api/orders/:id/status (EasyPaisa) - blocks confirming order before payment is marked 'paid'", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Test User",
          phone: "03001234567",
          city: "Lahore",
          address: "Sector Y, Phase 3, DHA Lahore",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "easypaisa",
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

  it("PATCH /api/orders/:id/payment (EasyPaisa) - admin marks payment as paid, then confirms order", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Test User 2",
          phone: "03001234567",
          city: "Lahore",
          address: "Main Boulevard, Gulberg III",
        },
        items: [{ productId: 1, quantity: 1, size: "42" }],
        paymentMethod: "easypaisa",
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

  it("PATCH /api/orders/:id/cancel - cancels order and restores product stock", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Usman",
          phone: "03119876543",
          city: "Kohat",
          address: "House 77, Street 5, Cantt Area",
        },
        items: [{ productId: 1, quantity: 2, size: "43" }],
        paymentMethod: "cod",
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

  it("GET /api/orders/track - tracks order by orderId", async () => {
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        customer: {
          name: "Bilal",
          phone: "03001234567",
          city: "Peshawar",
          address: "House 45, University Town, Peshawar",
        },
        items: [{ productId: 1, quantity: 1, size: "41" }],
        paymentMethod: "cod",
      });
    const orderId = createRes.body.data.orderId;

    const res = await request(app).get(`/api/orders/track?orderId=${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customer.name).toBe("Bilal");
  });
});