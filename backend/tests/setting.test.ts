/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { Setting } from "../models/Setting";
import { Admin } from "../models/Admin";

describe("⚙️ Store Settings API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Setting.deleteMany({});
    await Admin.deleteMany({});

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

    await Setting.create({
      phone: "+92 345 9680373",
      shippingFee: 250,
      freeShippingThreshold: 5000,
    });
  });

  it("GET /api/settings - returns store settings", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shippingFee).toBe(250);
  });

  it("PUT /api/settings - admin updates store settings", async () => {
    const res = await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ shippingFee: 300, announcementText: "Ramadan Flash Sale LIVE!" });
    expect(res.status).toBe(200);
    expect(res.body.data.shippingFee).toBe(300);
    expect(res.body.data.announcementText).toBe("Ramadan Flash Sale LIVE!");
  });
});

