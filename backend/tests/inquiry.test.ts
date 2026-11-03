import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Inquiry } from "../src/models/Inquiry";
import { Admin } from "../src/models/Admin";

describe("📬 Inquiries & Leads Management API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Inquiry.deleteMany({});
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

    await Inquiry.create({
      name: "Hamza Tariq",
      phone: "03211234567",
      email: "hamza@example.com",
      subject: "Wholesale Inquiry",
      message: "Do you supply bulk orders for shops in Peshawar?",
      source: "website",
      status: "new",
    });
  });

  it("POST /api/inquiries - validates required fields", async () => {
    const res = await request(app).post("/api/inquiries").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/inquiries - creates new lead/inquiry successfully", async () => {
    const res = await request(app).post("/api/inquiries").send({
      name: "Saleem Shah",
      phone: "03450000000",
      subject: "Size inquiry",
      message: "Is size 45 available in Skylite Slip-On?",
      source: "whatsapp",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.source).toBe("whatsapp");
  });

  it("GET /api/inquiries - admin lists inquiries", async () => {
    const res = await request(app)
      .get("/api/inquiries")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("PATCH /api/inquiries/:id - admin updates status and admin notes", async () => {
    const lead = await Inquiry.findOne();
    const res = await request(app)
      .patch(`/api/inquiries/${lead?._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "in_progress", adminNotes: "Called client, sent catalog on WhatsApp" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("in_progress");
    expect(res.body.data.adminNotes).toContain("WhatsApp");
  });

  it("DELETE /api/inquiries/:id - admin deletes inquiry", async () => {
    const lead = await Inquiry.findOne();
    const res = await request(app)
      .delete(`/api/inquiries/${lead?._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});

