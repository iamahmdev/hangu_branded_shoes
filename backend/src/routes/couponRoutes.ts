import { Router } from "express";
import {
  verifyCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public
router.post("/verify", verifyCoupon);

// Admin Protected
router.get("/", authenticate, getCoupons);
router.post("/", authenticate, createCoupon);
router.delete("/:id", authenticate, deleteCoupon);

export default router;

