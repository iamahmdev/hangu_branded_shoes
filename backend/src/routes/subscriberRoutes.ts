import { Router } from "express";
import {
  subscribe,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/subscriberController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public Newsletter
router.post("/subscribe", subscribe);

// Admin Management
router.get("/", authenticate, getSubscribers);
router.delete("/:id", authenticate, deleteSubscriber);

export default router;

