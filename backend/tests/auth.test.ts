import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Admin } from "../src/models/Admin";

describe("🔐 Authentication & Admin Management API Tests", () => {
  let adminToken: string;
  let adminId: string;

  beforeEach(async () => {
    await Admin.deleteMany({});

    // Create admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);
    const admin = await Admin.create({
      username: "admin",
      email: "admin@hangubrandedshoes.com",
      passwordHash,
      name: "Store Admin",
      role: "admin",
      permissions: ["*"],
      isActive: true,
    });
    adminId = admin._id.toString();

    // Login admin to get token
    const res = await request(app)
      .post("/api/admin/login")
      .send({ usernameOrEmail: "admin", password: "admin123" });
    adminToken = res.body.token;
  });

  it("POST /api/admin/login - returns 400 when missing credentials", async () => {
    const res = await request(app).post("/api/admin/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/admin/login - returns 401 for incorrect password", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .send({ usernameOrEmail: "admin", password: "wrongpassword" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/admin/login - returns 200 with JWT token for valid credentials", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .send({ usernameOrEmail: "admin", password: "admin123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin.role).toBe("admin");
  });

  it("GET /api/admin/me - returns 401 without Bearer token", async () => {
    const res = await request(app).get("/api/admin/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/admin/me - returns 200 with profile when authenticated", async () => {
    const res = await request(app)
      .get("/api/admin/me")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.admin.username).toBe("admin");
    expect(res.body.admin.role).toBe("admin");
  });

  it("PUT /api/admin/profile - updates profile details", async () => {
    const res = await request(app)
      .put("/api/admin/profile")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Chief Executive Officer" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.admin.name).toBe("Chief Executive Officer");
  });

  it("PUT /api/admin/change-password - changes password successfully", async () => {
    const res = await request(app)
      .put("/api/admin/change-password")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ currentPassword: "admin123", newPassword: "newsecurepass123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify login with new password
    const loginRes = await request(app)
      .post("/api/admin/login")
      .send({ usernameOrEmail: "admin", password: "newsecurepass123" });
    expect(loginRes.status).toBe(200);
  });

  it("POST /api/admin/forgot-password and POST /api/admin/reset-password - complete reset flow", async () => {
    const forgotRes = await request(app)
      .post("/api/admin/forgot-password")
      .send({ email: "admin@hangubrandedshoes.com" });
    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.resetToken).toBeDefined();

    const resetToken = forgotRes.body.resetToken;

    const resetRes = await request(app)
      .post("/api/admin/reset-password")
      .send({ resetToken, newPassword: "brandnewpassword99" });
    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // Verify login with reset password
    const loginRes = await request(app)
      .post("/api/admin/login")
      .send({ usernameOrEmail: "admin", password: "brandnewpassword99" });
    expect(loginRes.status).toBe(200);
  });

  it("POST /api/admin/register - requires admin authentication and creates new admin", async () => {
    // Unauthenticated forbidden (401)
    const failRes = await request(app)
      .post("/api/admin/register")
      .send({
        username: "newadmin",
        email: "newadmin@hangubrandedshoes.com",
        password: "password123",
        name: "Second Admin",
        role: "admin",
      });
    expect(failRes.status).toBe(401);

    // Authenticated admin allowed (201)
    const successRes = await request(app)
      .post("/api/admin/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "newadmin",
        email: "newadmin@hangubrandedshoes.com",
        password: "password123",
        name: "Second Admin",
        role: "admin",
      });
    expect(successRes.status).toBe(201);
    expect(successRes.body.admin.username).toBe("newadmin");
    expect(successRes.body.admin.role).toBe("admin");
  });

  it("GET /api/admin/dashboard - returns statistical data", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(typeof res.body.stats.totalRevenue).toBe("number");
  });
});
