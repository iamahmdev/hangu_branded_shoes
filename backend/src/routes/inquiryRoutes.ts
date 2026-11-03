import { Router } from "express";
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public Contact & Leads
router.post("/", createInquiry);

// Admin Management
router.get("/", authenticate, getInquiries);
router.patch("/:id", authenticate, updateInquiryStatus);
router.delete("/:id", authenticate, deleteInquiry);

export default router;

