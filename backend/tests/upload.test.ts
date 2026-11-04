/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Admin } from "../src/models/Admin";

describe("☁️ Cloudinary Image Upload & Management API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
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
  });

  it("POST /api/upload - returns 401 when unauthenticated", async () => {
    const res = await request(app).post("/api/upload");
    expect(res.status).toBe(401);
  });

  it("POST /api/upload - returns 400 when no file is attached", async () => {
    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/upload - rejects non-image files", async () => {
    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("image", Buffer.from("fake-text-file-content"), "document.txt");
    expect(res.status).toBe(500); // Multer filter throws error caught by global handler
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Only JPEG, PNG, WEBP, GIF, and SVG images are allowed");
  });

  it("POST /api/upload - uploads valid image and returns Cloudinary URL and publicId", async () => {
    // 1x1 transparent GIF buffer
    const fakeImageBuffer = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("image", fakeImageBuffer, "shoe-preview.gif");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toBeDefined();
    expect(res.body.data.publicId).toBeDefined();
  });

  it("DELETE /api/upload - deletes image from Cloudinary using publicId", async () => {
    const res = await request(app)
      .delete("/api/upload")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ publicId: "hangu-branded-shoes/test_image_123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

