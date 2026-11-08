import { Router } from "express";
import {
  getReviews,
  createReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/", getReviews);
router.post("/", createReview);

// Admin Management
router.get("/admin", authenticate, getAdminReviews);
router.patch("/:id", authenticate, updateReviewStatus);
router.delete("/:id", authenticate, deleteReview);

export default router;

