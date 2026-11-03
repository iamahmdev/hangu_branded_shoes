import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Subscriber } from "../src/models/Subscriber";
import { Admin } from "../src/models/Admin";

describe("📰 VIP Newsletter Subscribers API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Subscriber.deleteMany({});
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

    await Subscriber.create({ email: "existing@example.com" });
  });

  it("POST /api/newsletter/subscribe - validates email address", async () => {
    const res = await request(app).post("/api/newsletter/subscribe").send({ email: "invalid-email" });
    expect(res.status).toBe(400);
  });

  it("POST /api/newsletter/subscribe - subscribes new email successfully", async () => {
    const res = await request(app).post("/api/newsletter/subscribe").send({ email: "newsubscriber@gmail.com" });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/newsletter/subscribe - handles existing subscriber smoothly", async () => {
    const res = await request(app).post("/api/newsletter/subscribe").send({ email: "existing@example.com" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("GET /api/subscribers - admin gets subscriber list", async () => {
    const res = await request(app)
      .get("/api/subscribers")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("DELETE /api/subscribers/:id - admin deletes subscriber", async () => {
    const sub = await Subscriber.findOne();
    const res = await request(app)
      .delete(`/api/subscribers/${sub?._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});

