/// <reference types="jest" />
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { Review } from "../src/models/Review";
import { Admin } from "../src/models/Admin";

describe("⭐ Review System API Tests", () => {
  let adminToken: string;

  beforeEach(async () => {
    await Review.deleteMany({});
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

    await Review.create({
      shoeName: "Skylite Slip-On Sneaker",
      userName: "Tariq",
      city: "Peshawar",
      rating: 5,
      comment: "Very durable and comfortable pair!",
      status: "approved",
      verified: true,
    });
  });

  it("GET /api/reviews - returns approved reviews and stats", async () => {
    const res = await request(app).get("/api/reviews");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.stats.averageRating).toBe(5);
  });

  it("POST /api/reviews - submits new customer review", async () => {
    const res = await request(app).post("/api/reviews").send({
      shoeName: "Classic Derby Formal",
      userName: "Junaid Khan",
      city: "Islamabad",
      rating: 5,
      comment: "Outstanding leather quality. Loved it!",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userName).toBe("Junaid Khan");
  });

  it("GET /api/reviews/admin - admin gets all reviews", async () => {
    const res = await request(app)
      .get("/api/reviews/admin")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("PATCH /api/reviews/:id - admin updates review status", async () => {
    const review = await Review.findOne();
    const res = await request(app)
      .patch(`/api/reviews/${review?._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "rejected" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("rejected");
  });

  it("DELETE /api/reviews/:id - admin deletes review", async () => {
    const review = await Review.findOne();
    const res = await request(app)
      .delete(`/api/reviews/${review?._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const check = await Review.findById(review?._id);
    expect(check).toBeNull();
  });
});

