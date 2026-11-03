import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Coupon } from "../src/models/Coupon";
import { Admin } from "../src/models/Admin";

describe("🏷️ Coupon & Discount Management API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Coupon.deleteMany({});
    await Admin.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);
    await Admin.create({
      username: "admin",
      email: "admin@hangubrandedshoes.com",
      passwordHash,
      name: "Super Admin",
      role: "superadmin",
      isActive: true,
    });

    const res = await request(app)
      .post("/api/admin/login")
      .send({ usernameOrEmail: "admin", password: "admin123" });
    adminToken = res.body.token;

    await Coupon.create({
      code: "HANGU10",
      discountPercent: 10,
      minOrderAmount: 3000,
      isActive: true,
    });
  });

  it("POST /api/coupons/verify - verifies valid coupon and calculates discount", async () => {
    const res = await request(app)
      .post("/api/coupons/verify")
      .send({ code: "hangu10", subtotal: 6000 });
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.coupon.discountPercent).toBe(10);
    expect(res.body.coupon.discountAmount).toBe(600);
  });

  it("POST /api/coupons/verify - rejects when order is below minOrderAmount", async () => {
    const res = await request(app)
      .post("/api/coupons/verify")
      .send({ code: "HANGU10", subtotal: 2000 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/coupons/verify - returns 404 for invalid code", async () => {
    const res = await request(app)
      .post("/api/coupons/verify")
      .send({ code: "INVALIDCODE", subtotal: 5000 });
    expect(res.status).toBe(404);
  });

  it("POST /api/coupons - admin creates coupon", async () => {
    const res = await request(app)
      .post("/api/coupons")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        code: "SUMMER25",
        discountPercent: 25,
        minOrderAmount: 5000,
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe("SUMMER25");
  });

  it("DELETE /api/coupons/:id - admin deletes coupon", async () => {
    const coupon = await Coupon.findOne({ code: "HANGU10" });
    const res = await request(app)
      .delete(`/api/coupons/${coupon?._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

